import React, { useRef } from 'react';
import { io } from 'socket.io-client';
import * as mediasoupClient from "mediasoup-client";
import './MainVideo.css'; // Import the CSS file for styling

const socket = io(process.env.REACT_APP_MEDIA_SOUP_CONNECTION_END_POINT);

socket.on('connection-success', (res) => {
  console.log('connection success', res);
});

function MainVideo() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  let device;
  let rtpCapabilities;
  let producerTransport;
  let consumerTransport;
  let producer;
  let consumer;
  let isProducer = false;
  let params = {
    encodings: [
      {
        rid: 'r0',
        maxBitrate: 100000,
        scalabilityMode: 'S1T3',
      },
      {
        rid: 'r1',
        maxBitrate: 300000,
        scalabilityMode: 'S1T3',
      },
      {
        rid: 'r2',
        maxBitrate: 900000,
        scalabilityMode: 'S1T3',
      },
    ],
    codecOptions: {
      videoGoogleStartBitrate: 1000,
    },
  };

  const streamSuccess = (stream) => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    const track = stream.getVideoTracks()[0];
    params = {
      track,
      ...params,
    };

    goConnect(true);
  };

  const getLocalStream = () => {
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        width: {
          min: 640,
          max: 1920,
        },
        height: {
          min: 400,
          max: 1080,
        }
      }
    })
      .then(streamSuccess)
      .catch(error => {
        console.log(error.message)
      })
  }
  const goConsume = () => {
    goConnect(false)
  }

  const goConnect = (producerOrConsumer) => {
    isProducer = producerOrConsumer
    device === undefined ? getRtpCapabilities() : goCreateTransport()
  }

  const goCreateTransport = () => {
    isProducer ? createSendTransport() : createRecvTransport()
  }

  const createDevice = async () => {
    try {
      device = new mediasoupClient.Device()
  
      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#device-load
      // Loads the device with RTP capabilities of the Router (server side)
      await device.load({
        // see getRtpCapabilities() below
        routerRtpCapabilities: rtpCapabilities
      })
  
      console.log('Device RTP Capabilities', device.rtpCapabilities)
  
      // once the device loads, create transport
      goCreateTransport()
  
    } catch (error) {
      console.log(error)
      if (error.name === 'UnsupportedError')
        console.warn('browser not supported')
    }
  }

  const getRtpCapabilities = () => {
    // make a request to the server for Router RTP Capabilities
    // see server's socket.on('getRtpCapabilities', ...)
    // the server sends back data object which contains rtpCapabilities
    socket.emit('createRoom', (data) => {
      console.log(`Router RTP Capabilities... ${data.rtpCapabilities}`)
  
      // we assign to local variable and will be used when
      // loading the client Device (see createDevice above)
      rtpCapabilities = data.rtpCapabilities
  
      // once we have rtpCapabilities from the Router, create Device
      createDevice()
    })
  }

  const createSendTransport = () => {
    // see server's socket.on('createWebRtcTransport', sender?, ...)
    // this is a call from Producer, so sender = true
    socket.emit('createWebRtcTransport', { sender: true }, ({ params }) => {
      // The server sends back params needed 
      // to create Send Transport on the client side
      if (params.error) {
        console.log(params.error)
        return
      }

      console.log(params)

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
        console.log(parameters)

        try {
          // tell the server to create a Producer
          // with the following parameters and produce
          // and expect back a server side producer id
          // see server's socket.on('transport-produce', ...)
          await socket.emit('transport-produce', {
            kind: parameters.kind,
            rtpParameters: parameters.rtpParameters,
            appData: parameters.appData,
          }, ({ id }) => {
            // Tell the transport that parameters were transmitted and provide it with the
            // server side producer's id.
            callback({ id })
          })
        } catch (error) {
          errback(error)
        }
      })
      connectSendTransport()
    })
  }

  const connectSendTransport = async () => {
    // we now call produce() to instruct the producer transport
    // to send media to the Router
    // https://mediasoup.org/documentation/v3/mediasoup-client/api/#transport-produce
    // this action will trigger the 'connect' and 'produce' events above
    console.log("params", params)
    producer = await producerTransport.produce(params)

    producer.on('trackended', () => {
      console.log('track ended')

      // close video track
    })

    producer.on('transportclose', () => {
      console.log('transport ended')

      // close video track
    })
  }
  const createRecvTransport = async () => {
    // see server's socket.on('consume', sender?, ...)
    // this is a call from Consumer, so sender = false
    await socket.emit('createWebRtcTransport', { sender: false }, ({ params }) => {
      // The server sends back params needed 
      // to create Send Transport on the client side
      if (params.error) {
        console.log(params.error)
        return
      }

      console.log(params)

      // creates a new WebRTC Transport to receive media
      // based on server's consumer transport params
      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#device-createRecvTransport
      consumerTransport = device.createRecvTransport(params)

      // https://mediasoup.org/documentation/v3/communication-between-client-and-server/#producing-media
      // this event is raised when a first call to transport.produce() is made
      // see connectRecvTransport() below
      consumerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
          // Signal local DTLS parameters to the server side transport
          // see server's socket.on('transport-recv-connect', ...)
          await socket.emit('transport-recv-connect', {
            dtlsParameters,
          })

          // Tell the transport that parameters were transmitted.
          callback()
        } catch (error) {
          // Tell the transport that something was wrong
          errback(error)
        }
      })

      connectRecvTransport();
    })
  }

  const connectRecvTransport = async () => {
    console.log('connectRecvTransport called');

    try {
      await socket.emit('consume', {
        rtpCapabilities: device.rtpCapabilities,
      }, async ({ params }) => {
        if (params.error) {
          console.error('Cannot Consume:', params.error);
          return;
        }

        console.log('Consumer params received:', params);

        try {
          consumer = await consumerTransport.consume({
            id: params.id,
            producerId: params.producerId,
            kind: params.kind,
            rtpParameters: params.rtpParameters,
          });

          console.log('Consumer successfully created:', consumer);

          const { track } = consumer;
          if (!track) {
            console.error('No track found in consumer');
            return;
          }

          const mediaStream = new MediaStream([track]);
          if (!mediaStream) {
            console.error('Failed to create media stream from track');
            return;
          }

          remoteVideoRef.current.srcObject = mediaStream;

          console.log('Remote video track successfully set');

          // Resume the consumer to start receiving media.
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




  return (
    <div id="video">
      <table>
        <thead>
          <tr>
            <th>Local Video</th>
            <th>Remote Video</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div id="sharedBtns">
                <video ref={localVideoRef} autoPlay className="video"></video>
              </div>
            </td>
            <td>
              <div id="sharedBtns">
                <video ref={remoteVideoRef} autoPlay className="video"></video>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div id="sharedBtns">
                <button id="btnLocalVideo" onClick={getLocalStream}>Publish</button>
              </div>
            </td>
            <td>
              <div id="sharedBtns">
                <button id="btnRecvSendTransport" onClick={goConsume}>Consume</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default MainVideo;
