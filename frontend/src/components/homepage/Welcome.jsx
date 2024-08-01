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
                    fontSize: "2vw",
                    marginTop:"1rem"
                }}
            >
                Welcome to Social360
            </Box>
            <Box
                sx={{
                    textAlign: "center",
                    fontSize: "1vw"
                }}
            >
                Let's get started!
            </Box>

        </Box>
    );
}

export default Welcome;