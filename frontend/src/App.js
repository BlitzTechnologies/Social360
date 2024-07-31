import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

function App() {
  return (
    <div className="App">
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{
          width: "100%",
          border: "solid, 1px, red"
        }}
      >
        <TextField
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          sx={{
            border: "solid, 10px, green "
          }}
        />
        <TextField id="filled-basic" label="Filled" variant="filled" />
        <TextField id="standard-basic" label="Standard" variant="standard" />
      </Box>
    </div>
  );
}

export default App;
