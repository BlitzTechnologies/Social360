import React, { useRef, useEffect } from 'react';
import RoomMenu from './RoomMenu';
import { textAlign, width } from '@mui/system';
import { Box } from '@mui/system';

function VideoChat() {
    const videoRef = useRef(null);

    useEffect(() => {
        const getMedia = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (error) {
                console.error('Error accessing the media devices.', error);
            }
        };

        getMedia();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    const handleCreateClick = () => {
        console.log('Create Room button clicked');
    };

    const handleJoinClick = () => {
        console.log('Join Room button clicked');
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: "3%", marginBottom: "3%" }}>
            <Box
                sx={{
                    width: {
                        xs: '100%',   // 100% width on extra small screens
                        sm: '75%',    // 75% width on small screens
                        md: '60%',    // 60% width on medium screens
                        lg: '50%'     // 50% width on large screens
                    },
                    maxWidth: '800px' // Maximum width of the video element
                }}
            >
                <video ref={videoRef} autoPlay style={{ width: '100%', height: 'auto' }}/>
            </Box>
            <RoomMenu onCreateClick={handleCreateClick} onJoinClick={handleJoinClick} />
        </div>
    );
}

export default VideoChat;
