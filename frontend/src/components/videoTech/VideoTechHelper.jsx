import * as mediasoupClient from "mediasoup-client";

// get local video detaisl and config.
export const getLocalStream = (callback) => {
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
        .then(callback)
        .catch(error => {
            console.log(error.message);
        });
};

// initializes and loads a mediasoupclient device.
export const initDevice = async (rtpCapabilities) => {
    try {
        let device = new mediasoupClient.Device()

        await device.load({
            routerRtpCapabilities: rtpCapabilities
        })

        console.log('Device RTP Capabilities', device.rtpCapabilities)

        return device;

    } catch (error) {
        console.log(error)
        if (error.name === 'UnsupportedError')
            console.warn('browser not supported')
    }
}

export const connectSendTransport = async (audioParams, videoParams, videoProducer, producerTransport) => {
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

export const getProducers = (socket, callback) => {
    socket.emit('getProducers', producerIds => {
        console.log(producerIds)
        producerIds.forEach(callback)
    })
}

export const createVideoElement = (videoContainerRef, mediaStream, remoteProducerId) => {
    // Create new video element
    const newElem = document.createElement('div');
    newElem.setAttribute('id', `td-${remoteProducerId}`);

    const videoElem = document.createElement('video');
    videoElem.id = `remoteVideo-${remoteProducerId}`;
    videoElem.className = 'remote-video';
    videoElem.srcObject = mediaStream;
    videoElem.autoplay = true;
    videoElem.muted = false;

    // Append video element to container
    newElem.appendChild(videoElem);

    if (videoContainerRef.current) {
        videoContainerRef.current.appendChild(newElem);
    }

    // Ensure video is playing
    videoElem.play().catch(error => {
        console.error('Error trying to play video:', error);
    });
}

export const removeVideoElement = (videoContainerRef, remoteProducerId) => {
    // Remove the video element by ID using the ref
    const videoContainer = videoContainerRef.current;
    if (videoContainer) {
        const videoElement = document.getElementById(`td-${remoteProducerId}`);
        if (videoElement) {
            videoContainer.removeChild(videoElement);
        }
    }
}
