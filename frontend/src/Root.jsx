import { Outlet, ScrollRestoration } from 'react-router-dom';
import Footer from './components/common/Footer';
import Navbar from './components/common/Navbar';
import { Box, createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import './index.css';
import { AlertProvider } from './contexts/AlertContext';
import AlertComponenet from './components/common/Alert';
import { AuthProvider } from './contexts/AuthContext';

// Create a theme instance.
const theme = createTheme({
    typography: {
        fontFamily: 'Poppins, Arial, sans-serif'
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    fontFamily: 'Poppins, Arial, sans-serif',
                }
            }
        }
    }
});

function Root() {
    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline /> {/* Ensures the baseline styles are applied globally */}
                <AlertProvider>
                    <AuthProvider>
                        <Navbar />
                        <AlertComponenet />
                        <Box
                            sx={{
                                minHeight: "84vh",
                            }}
                        >
                            <Outlet />
                        </Box>
                        <Footer />
                        <ScrollRestoration />
                    </AuthProvider>
                </AlertProvider>
            </ThemeProvider>
        </>
    );
}

export default Root;
