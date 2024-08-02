import { Box } from "@mui/material";
import { Grid } from '@mui/material';

function Welcome() {
    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                fontFamily: "Poppins",
                flexDirection: "column",
            }}
        >
            <Box
                sx={{
                    textAlign: "center",
                    fontSize: {
                        xs: '25px', // Ensures minimum of 12px, scales with 1.5vw, not exceeding 16px
                        sm: '35px', // Adjust the values as needed for different breakpoints
                        md: '40px',
                        lg: '45px'
                      },
                    marginTop:"1rem"
                }}
            >
                Welcome to Social360
            </Box>
            <Box
                sx={{
                    textAlign: "center",
                    fontSize: {
                        xs: '15px',  // smaller on the smallest screens
                        sm: '20px', // slightly larger as the screen grows
                        md: '25px',    // target size for medium screens
                        lg: '35px'  // slightly larger on large screens
                    }
                }}
            >
                Let's get started!
            </Box>

        </Box>
    );
}

export default Welcome;