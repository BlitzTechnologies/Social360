import { Box } from "@mui/material";

function Welcome() {
    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center"
            }}
        >
            <Box
                sx={{
                    width: "50%",
                    textAlign: "center",
                    fontFamily: "Poppins",
                    fontSize: "3vw",
                    marginTop:"1rem"
                }}
            >
                Welcome to Social360
            </Box>
        </Box>
    );
}

export default Welcome;