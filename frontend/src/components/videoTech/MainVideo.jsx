import React, { useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import * as mediasoupClient from "mediasoup-client";
import './MainVideo.css'; // Import the CSS file for styling
import { params } from './VideoTechConstants';
import { connectSendTransport, createVideoElement, getLocalStream, getProducers, initDevice, removeVideoElement } from './VideoTechHelper';
const socket = io(process.env.REACT_APP_MEDIA_SOUP_CONNECTION_END_POINT);

socket.on('connection-success', (res) => {
  console.log('connection success', res);
});
function MainVideo() {

  const localVideoRef = useRef(null);
  const videoContainerRef = useRef(null);

  const roomName = window.location.pathname.split('/')[2];
  let device
  let rtpCapabilities
  let producerTransport
  let consumerTransports = []
  let audioProducer
  let videoProducer

  let audioParams;
  let videoParams = { params };
  let consumingTransports = [];

  const streamSuccess = (stream) => {
    console.log('samplevideo', stream)
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    const track = stream.getVideoTracks()[0];
    // Assign the tracks to params
    audioParams = { track: stream.getAudioTracks()[0] };
    videoParams = { track, ...videoParams };

    // Log track details for debugging
    console.log('Audio Track:', audioParams.track);
    console.log('Video Track:', videoParams.track);

    joinRoom();
  };


  const joinRoom = () => {
    socket.emit('joinRoom', { roomName }, (data) => {
      console.log('Router RTP capabilities...', data.rtpCapabilities)
      rtpCapabilities = data.rtpCapabilities;

      createDevice();
    })
  }

  // create mediasoup device, acts as agent in the process.
  const createDevice = async () => {
    device = await initDevice(rtpCapabilities);

    createSendTransport()
  }

  const createSendTransport = () => {
    socket.emit('createWebRtcTransport', { consumer: false }, ({ params }) => {
      if (params.error) {
        console.log(params.error)
        return
      }

      console.log('create web rtc trasnport server response:', params)

      // creates a new WebRTC Transport to send media
      // based on the server's producer transport params
      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#TransportOptions
      producerTransport = device.createSendTransport(params)

      // https://mediasoup.org/documentation/v3/communication-between-client-and-server/#producing-media
      // this event is raised when a first call to transport.produce() is made
      // see connectSendTransport() below
      producerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
          // Signal local DTLS parameters to the server side transport
          // see server's socket.on('transport-connect', ...)
          await socket.emit('transport-connect', {
            dtlsParameters,
          })

          // Tell the transport that parameters were transmitted.
          callback()

        } catch (error) {
          errback(error)
        }
      })

      producerTransport.on('produce', async (parameters, callback, errback) => {
        console.log('produce prarms:', parameters);

        try {
          // tell the server to create a Producer
          // with the following parameters and produce
          // and expect back a server side producer id
          // see server's socket.on('transport-produce', ...)
          await socket.emit('transport-produce', {
            kind: parameters.kind,
            rtpParameters: parameters.rtpParameters,
            appData: parameters.appData,
          }, ({ id, producersExist }) => {
            // Tell the transport that parameters were transmitted and provide it with the
            // server side producer's id.
            callback({ id })

            // if producers exist, then join room
            if (producersExist) getProducers(socket, signalNewConsumerTransport)
          })
        } catch (error) {
          errback(error)
        }
      })

      connectSendTransport(audioParams, videoParams, videoProducer, producerTransport);
    })
  }

  const signalNewConsumerTransport = async (remoteProducerId) => {
    //check if we are already consuming the remoteProducerId
    if (consumingTransports.includes(remoteProducerId)) return;
    consumingTransports.push(remoteProducerId);

    await socket.emit('createWebRtcTransport', { consumer: true }, ({ params }) => {
      // The server sends back params needed 
      // to create Send Transport on the client side
      if (params.error) {
        console.log(params.error)
        return
      }
      console.log(`PARAMS... ${params}`)

      let consumerTransport
      try {
        consumerTransport = device.createRecvTransport(params)
      } catch (error) {
        // exceptions: 
        // {InvalidStateError} if not loaded
        // {TypeError} if wrong arguments.
        console.log(error)
        return
      }

      consumerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
          // Signal local DTLS parameters to the server side transport
          // see server's socket.on('transport-recv-connect', ...)
          await socket.emit('transport-recv-connect', {
            dtlsParameters,
            serverConsumerTransportId: params.id,
          })

          // Tell the transport that parameters were transmitted.
          callback()
        } catch (error) {
          // Tell the transport that something was wrong
          errback(error)
        }
      })

      connectRecvTransport(consumerTransport, remoteProducerId, params.id)
    })
  }

  socket.on('new-producer', ({ producerId }) => {
    signalNewConsumerTransport(producerId);
  })

  const connectRecvTransport = async (consumerTransport, remoteProducerId, serverConsumerTransportId) => {
    console.log('connectRecvTransport called');

    try {
      await socket.emit('consume', {
        rtpCapabilities: device.rtpCapabilities,
        remoteProducerId,
        serverConsumerTransportId,
      }, async ({ params }) => {
        if (params.error) {
          console.error('Cannot Consume:', params.error);
          return;
        }

        console.log('Consumer params received:', params);

        try {
          const consumer = await consumerTransport.consume({
            id: params.id,
            producerId: params.producerId,
            kind: params.kind,
            rtpParameters: params.rtpParameters,
          });

          consumerTransports.push({
            consumerTransport,
            serverConsumerTransportId: params.id,
            producerId: remoteProducerId,
            consumer
          });

          const { track } = consumer;
          if (!track) {
            console.error('No track found in consumer');
            return;
          }

          const mediaStream = new MediaStream([track]);

          createVideoElement(videoContainerRef, mediaStream, remoteProducerId);

          console.log('Consumer successfully created:', consumer);

          socket.emit('consumer-resume', consumer.id, () => {
            console.log('Consumer resumed');
          });

        } catch (consumeError) {
          console.error('Error during consume process:', consumeError.message);
        }
      });
    } catch (emitError) {
      console.error('Error during socket emit or consume callback:', emitError.message);
    }
  };

  socket.on('producer-closed', ({ remoteProducerId }) => {
    // Find and close the consumer transport
    const producerToClose = consumerTransports.find(transportData => transportData.producerId === remoteProducerId);
    if (producerToClose) {
      producerToClose.consumerTransport.close();
      producerToClose.consumer.close();

      // Remove the consumer transport from the list
      consumerTransports = consumerTransports.filter(transportData => transportData.producerId !== remoteProducerId);

      removeVideoElement(videoContainerRef, remoteProducerId);
    }
  })

  return (
    <div id="video">
      <table className="mainTable">
        <tbody>
          <tr>
            <td className="localColumn">
              <video ref={localVideoRef} autoPlay ></video>
              <button onClick={() => { getLocalStream(streamSuccess) }}>
                start producing
              </button>
            </td>
            <td className="remoteColumn">
              <div ref={videoContainerRef} id="videoContainer">
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            <td>

            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default MainVideo;
