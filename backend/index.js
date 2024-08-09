const express = require('express');
require('dotenv').config();
const AuthRoutes = require('./routes/AuthRoute.js')
const userRoutes = require('./routes/UserRoute');
const roomRoutes = require('./routes/RoomRoute.js')
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL, 
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));

const port = process.env.BACKEND_PORT;

app.use(express.json());

app.use('/auth', AuthRoutes);
app.use('/users', userRoutes);
app.use('/rooms', roomRoutes);
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
