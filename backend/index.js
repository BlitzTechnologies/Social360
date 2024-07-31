const express = require('express');
require('dotenv').config();

const app = express();

const port = process.env.BACKEND_PORT;


app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/about', (req, res) => {
  res.send('About Page');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
