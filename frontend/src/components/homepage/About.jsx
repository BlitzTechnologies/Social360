import { Box } from "@mui/material";

function About() {
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
                    textAlign: "center"
                }}
            >
                Welcome to Social360
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Et dolores suscipit maiores quia. Dolorum necessitatibus quisquam praesentium veritatis sint laborum repudiandae impedit obcaecati non distinctio! Eligendi sequi voluptas voluptatem ex.
            </Box>
        </Box>
    );
}

export default About;