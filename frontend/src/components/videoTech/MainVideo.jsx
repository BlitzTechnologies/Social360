import React, { useRef, useEffect } from 'react';
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
  const videoContainerRef = useRef(null);

  const roomName = window.location.pathname.split('/')[2];
  console.log('roomName', roomName)
  let device
  let rtpCapabilities
  let producerTransport
  let consumerTransports = []
  let audioProducer
  let videoProducer
  let consumer
  let isProducer = false
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

  let audioParams;
  let videoParams = { params };
  let consumingTransports = [];

  const streamSuccess = (stream) => {
    console.log('samplevideo',stream)
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    const track = stream.getVideoTracks()[0];
    params = {
      track,
      ...params,
    };
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

  const getLocalStream = () => {
    navigator.mediaDevices.getUserMedia({
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
      createSendTransport()
  
    } catch (error) {
      console.log(error)
      if (error.name === 'UnsupportedError')
        console.warn('browser not supported')
    }
  }

  const createSendTransport = () => {
    // see server's socket.on('createWebRtcTransport', sender?, ...)
    // this is a call from Producer, so sender = true
    socket.emit('createWebRtcTransport', { consumer: false }, ({ params }) => {
      // The server sends back params needed 
      // to create Send Transport on the client side
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
            if (producersExist) getProducers()
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
    
    if (!audioParams.track || !videoParams.track) {
      console.error('Audio or Video track is missing');
    }
  
    try {
      // audioProducer = await producerTransport.produce(audioParams);
      videoProducer = await producerTransport.produce(videoParams);
    } catch (error) {
      console.error('Error producing track:', error.message);
    }
  
    // audioProducer.on('trackended', () => {
    //   console.log('audio track ended')
  
    //   // close audio track
    // })
  
    // audioProducer.on('transportclose', () => {
    //   console.log('audio transport ended')
  
    //   // close audio track
    // })
    
    videoProducer.on('trackended', () => {
      console.log('video track ended')
  
      // close video track
    })
  
    videoProducer.on('transportclose', () => {
      console.log('video transport ended')
  
      // close video track
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

  const getProducers = () => {
    socket.emit('getProducers', producerIds => {
      console.log(producerIds)
      // for each of the producer create a consumer
      // producerIds.forEach(id => signalNewConsumerTransport(id))
      producerIds.forEach(signalNewConsumerTransport)
    })
  }


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
  
          consumerTransports = [
            ...consumerTransports,
            {
              consumerTransport,
              serverConsumerTransportId: params.id,
              producerId: remoteProducerId,
              consumer
            }
          ];
  
          const { track } = consumer;
          if (!track) {
            console.error('No track found in consumer');
            return;
          }
  
          console.log('Track:', track);
          console.log('Track Settings:', track.getSettings());
          console.log('Track State:', track.readyState);
  
          const mediaStream = new MediaStream([track]);
          console.log('MediaStream:', mediaStream);
          console.log('Tracks in MediaStream:', mediaStream.getTracks());
  
          // Create new video element
          const newElem = document.createElement('div');
          newElem.setAttribute('id', `td`);
  
          const videoElem = document.createElement('video');
          videoElem.id = `remoteVideo`;
          videoElem.className = 'remote-video';
          videoElem.srcObject = mediaStream;
          videoElem.autoplay = true;
          videoElem.muted = true;
  
          // Append video element to container
          newElem.appendChild(videoElem);
  
          if (videoContainerRef.current) {
            videoContainerRef.current.appendChild(newElem);
          }
  
          // Ensure video is playing
          videoElem.play().catch(error => {
            console.error('Error trying to play video:', error);
          });
  
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
    // server notification is received when a producer is closed
    // we need to close the client-side consumer and associated transport
    const producerToClose = consumerTransports.find(transportData => transportData.producerId === remoteProducerId)
    producerToClose.consumerTransport.close()
    producerToClose.consumer.close()
  
    // remove the consumer transport from the list
    consumerTransports = consumerTransports.filter(transportData => transportData.producerId !== remoteProducerId)
  
    // remove the video div element
    // videoContainer.removeChild(document.getElementById(`td-${remoteProducerId}`))
  })

  return (
    <div id="video">
      <table className="mainTable">
        <tbody>
          <tr>
            <td className="localColumn">
              <video ref={localVideoRef} autoPlay ></video>
              <button onClick={getLocalStream}>
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
