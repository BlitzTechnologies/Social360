import React, { useRef } from 'react';
import { io } from 'socket.io-client';
import './MainVideo.css'; // Import the CSS file for styling

const socket = io(process.env.REACT_APP_MEDIA_SOUP_CONNECTION_END_POINT);

socket.on('connection-success', (res) => {
  console.log('connection success', res);
});

function MainVideo() {
  const localVideoRef = useRef(null);

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

  const streamSuccess = async (stream) => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    const track = stream.getVideoTracks()[0];
    params = {
      track,
      ...params,
    };
  };

  const getLocalStream = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          width: {
            min: 640,
            max: 1920,
          },
          height: {
            min: 400,
            max: 1080,
          },
        },
      })
      .then(streamSuccess)
      .catch((error) => {
        console.error('Error accessing media devices.', error);
      });
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
                <video id="remoteVideo" autoPlay className="video"></video>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div id="sharedBtns">
                <button onClick={getLocalStream}>1. Get Local Video</button>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <div id="sharedBtns">
                <button id="btnRtpCapabilities">2. Get Rtp Capabilities</button>
                <br />
                <button id="btnDevice">3. Create Device</button>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div id="sharedBtns">
                <button id="btnCreateSendTransport">4. Create Send Transport</button>
                <br />
                <button id="btnConnectSendTransport">5. Connect Send Transport & Produce</button>
              </div>
            </td>
            <td>
              <div id="sharedBtns">
                <button id="btnRecvSendTransport">6. Create Recv Transport</button>
                <br />
                <button id="btnConnectRecvTransport">7. Connect Recv Transport & Consume</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default MainVideo;
