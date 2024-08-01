import { Outlet, ScrollRestoration } from 'react-router-dom';
import Footer from './components/common/Footer';
import Navbar from './components/common/Navbar';
import { Box } from '@mui/material';


function Root() {
    return (
        <>
            <Navbar />
            <Box
                sx={{
                    minHeight: "86vh",
                    fontFamily: "Poppins"
                }}
            >
                <Outlet
                />
            </Box>
            <Footer />
            <ScrollRestoration />
        </>
    );
}

export default Root;
