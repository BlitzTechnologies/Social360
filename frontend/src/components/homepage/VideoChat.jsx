import React, { useRef, useEffect } from 'react';
import RoomMenu from './RoomMenu';
import { Box } from '@mui/system';
import { Paper } from '@mui/material';

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
                        xs: '90%',
                        sm: '75%',
                        md: '60%', 
                        lg: '50%'
                    },
                    maxWidth: '800px' 
                }}
            >
            <Paper

                elevation={6} 
                sx={{
                    width: '100%',
                    maxWidth: '800px',
                    height: { xs: 'calc(100vw * 9 / 16)', sm: 'calc(75vw * 9 / 16)', md: 'calc(60vw * 9 / 16)', lg: 'calc(50vw * 9 / 16)' },
                    maxHeight: '450px',
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <video ref={videoRef} autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                </Paper>
            </Box>
            <RoomMenu onCreateClick={handleCreateClick} onJoinClick={handleJoinClick} />
        </div>
    );
}

export default VideoChat;
