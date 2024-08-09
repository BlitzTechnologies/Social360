const express = require('express');
require('dotenv').config();
const AuthRoutes = require('./routes/AuthRoute.js');
const userRoutes = require('./routes/UserRoute');
const roomRoutes = require('./routes/RoomRoute.js'); // Import the route normally
const cors = require("cors");
const http = require('http');
const { Server } = require('socket.io');
const mediasoup = require('mediasoup'); // Import Mediasoup

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

// Create an HTTP server and integrate with Socket.IO
const server = http.createServer(app);
const IO = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

const peers = IO.of('/mediasoup');

let worker;
let router;

const createWorker = async () => {
  worker = await mediasoup.createWorker({
    rtcMinPort: 2000,
    rtcMaxPort: 2020,
  })
  console.log(`worker pid ${worker.pid}`)

  worker.on('died', error => {
    // This implies something serious happened, so kill the application
    console.error('mediasoup worker has died')
    setTimeout(() => process.exit(1), 2000) // exit in 2 seconds
  })

  return worker
}

// We create a Worker as soon as our application starts
worker = createWorker()

const mediaCodecs = [
  {
    kind: 'audio',
    mimeType: 'audio/opus',
    clockRate: 48000,
    channels: 2,
  },
  {
    kind: 'video',
    mimeType: 'video/VP8',
    clockRate: 90000,
    parameters: {
      'x-google-start-bitrate': 1000,
    },
  },
]


peers.on('connection', async (socket) => {
  console.log(socket.id);
  socket.emit('connection-success', {
    socketId: socket.id
  })
  socket.on('disconnect', () => {
    // do some cleanup
    console.log('peer disconnected')
  })
  router = await worker.createRouter({ mediaCodecs, })
})

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
