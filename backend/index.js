const express = require('express');
require('dotenv').config();
const AuthRoutes = require('./routes/AuthRoute.js');
const userRoutes = require('./routes/UserRoute');
const roomRoutes = require('./routes/RoomRoute.js'); // Import the route normally
const cors = require("cors");
const http = require('http');
const { Server } = require('socket.io');
const mediasoup = require('mediasoup'); // Import Mediasoup
const { createRoom, createPeer, createWebRtcTransport, addTransport, getTransport, addProducer, informConsumers } = require('./modules/rooms/VideoHelper.js');

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

const connections = IO.of('/mediasoup');

let worker;
let rooms = {}          // { roomName1: { Router, rooms: [ sicketId1, ... ] }, ...}
let peers = {}          // { socketId1: { roomName1, socket, transports = [id1, id2,] }, producers = [id1, id2,] }, consumers = [id1, id2,], peerDetails }, ...}
let transports = []     // [ { socketId1, roomName1, transport, consumer }, ... ]
let producers = []      // [ { socketId1, roomName1, producer, }, ... ]
let consumers = []      // [ { socketId1, roomName1, consumer, }, ... ]

const createWorker = async () => {
  worker = await mediasoup.createWorker({
    rtcMinPort: 2000,
    rtcMaxPort: 2100,
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


connections.on('connection', async (socket) => {
  console.log(socket.id);
  socket.emit('connection-success', {
    socketId: socket.id,
  })

  const removeItems = (items, socketId, type) => {
    items.forEach(item => {
      if (item.socketId === socket.id) {
        item[type].close()
      }
    })
    items = items.filter(item => item.socketId !== socket.id)

    return items
  }

  socket.on('disconnect', () => {
    if (peers[socket.id]) {
      console.log('Peer disconnected:', socket.id);

      consumers = removeItems(consumers, socket.id, 'consumer');
      producers = removeItems(producers, socket.id, 'producer');
      transports = removeItems(transports, socket.id, 'transport');

      const targetRoomName = peers[socket.id].roomName;
      delete peers[socket.id];

      // Remove socket from the room
      if (rooms[targetRoomName]) {
        rooms[targetRoomName] = {
          router: rooms[targetRoomName].router,
          peers: rooms[targetRoomName].peers.filter(socketId => socketId !== socket.id)
        };
      }
    } else {
      console.log('Peer not found for socket.id:', socket.id);
    }
  });


  socket.on('joinRoom', async ({ roomName }, callback) => {
    console.log("roomname:'", roomName)
    // create Router if it does not exist
    // const router1 = rooms[roomName] && rooms[roomName].get('data').router || await createRoom(roomName, socket.id)
    const router1 = await createRoom(rooms, roomName, socket.id, worker, mediaCodecs);

    createPeer(peers, socket, roomName);

    console.log("created room peers", peers)

    // get Router RTP Capabilities
    const rtpCapabilities = router1.rtpCapabilities

    // call callback from the client and send back the rtpCapabilities
    callback({ rtpCapabilities })
  })

  // Client emits a request for RTP Capabilities
  // This event responds to the request
  socket.on('getRtpCapabilities', (callback) => {

    const rtpCapabilities = router.rtpCapabilities

    console.log('rtp Capabilities', rtpCapabilities)

    // call callback from the client and send back the rtpCapabilities
    callback({ rtpCapabilities })
  })

  // Client emits a request to create server side Transport
  // We need to differentiate between the producer and consumer transports
  socket.on('createWebRtcTransport', async ({ consumer }, callback) => {

    const roomName = peers[socket.id].roomName

    const router = rooms[roomName].router

    createWebRtcTransport(router).then(
      transport => {
        callback({
          params: {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters,
          }
        })

        // add transport to Peer's properties
        addTransport(transports, peers, socket, transport, roomName, consumer)
      },
      error => {
        console.log(error)
      })
  })

  const addConsumer = (consumer, roomName) => {
    // add the consumer to the consumers list
    consumers = [
      ...consumers,
      { socketId: socket.id, consumer, roomName, }
    ]

    // add the consumer id to the peers list
    peers[socket.id] = {
      ...peers[socket.id],
      consumers: [
        ...peers[socket.id].consumers,
        consumer.id,
      ]
    }
  }

  socket.on('getProducers', callback => {
    //return all producer transports
    const { roomName } = peers[socket.id]

    let producerList = []
    producers.forEach(producerData => {
      if (producerData.socketId !== socket.id && producerData.roomName === roomName) {
        producerList = [...producerList, producerData.producer.id]
      }
    })

    // return the producer list back to the client
    callback(producerList)
  })

  // see client's socket.emit('transport-connect', ...)
  socket.on('transport-connect', ({ dtlsParameters }) => {
    console.log('DTLS PARAMS... ', { dtlsParameters })

    let targetTransport = getTransport(transports, socket.id);
    if (targetTransport) {
      console.log('transport connect success, target transport: ', targetTransport);
      targetTransport.connect({ dtlsParameters });
      return;
    }
    console.log('target transport not found');
  })

  // see client's socket.emit('transport-produce', ...)
  socket.on('transport-produce', async ({ kind, rtpParameters, appData }, callback) => {
    // call produce based on the prameters from the client
    const producer = await getTransport(transports, socket.id).produce({
      kind,
      rtpParameters,
    })

    // add producer to the producers array
    const { roomName } = peers[socket.id]

    addProducer(socket, producers, peers, producer, roomName)

    informConsumers(producers, peers, roomName, socket.id, producer.id)

    console.log('Producer ID: ', producer.id, producer.kind)

    producer.on('transportclose', () => {
      console.log('transport for this producer closed ')
      producer.close()
    })

    // Send back to the client the Producer's id
    callback({
      id: producer.id,
      producersExist: producers.length > 1 ? true : false
    })
  })

  // see client's socket.emit('transport-recv-connect', ...)
  socket.on('transport-recv-connect', async ({ dtlsParameters, serverConsumerTransportId }) => {
    console.log(`DTLS PARAMS: ${dtlsParameters}`)
    const consumerTransport = transports.find(transportData => (
      transportData.consumer && transportData.transport.id == serverConsumerTransportId
    )).transport
    await consumerTransport.connect({ dtlsParameters })
  })

  socket.on('consume', async ({ rtpCapabilities, remoteProducerId, serverConsumerTransportId }, callback) => {
    try {
      console.log(`Consume request received:`, { rtpCapabilities, remoteProducerId, serverConsumerTransportId });
  
      // Retrieve the room and router for this peer
      const { roomName } = peers[socket.id];
      const router = rooms[roomName].router;
      console.log(`Room Name: ${roomName}, Router ID: ${router.id}`);
  
      // Find the transport for this consumer
      let consumerTransport = transports.find(transportData => (
        transportData.consumer && transportData.transport.id == serverConsumerTransportId
      )).transport;
  
      if (!consumerTransport) {
        console.error(`Consumer transport with ID ${serverConsumerTransportId} not found`);
        return callback({
          params: {
            error: `Consumer transport with ID ${serverConsumerTransportId} not found`
          }
        });
      }
  
      console.log(`Consumer transport found: ${consumerTransport.id}`);
  
      // Check if the router can consume the producer
      if (router.canConsume({
        producerId: remoteProducerId,
        rtpCapabilities
      })) {
        console.log(`Router can consume producer ${remoteProducerId}`);
  
        const consumer = await consumerTransport.consume({
          producerId: remoteProducerId,
          rtpCapabilities,
          paused: true,
        });
  
        console.log(`Consumer created: ${consumer.id}, kind: ${consumer.kind}`);
  
        // Add event listeners for the consumer
        consumer.on('transportclose', () => {
          console.log('Transport closed for consumer');
        });
  
        consumer.on('producerclose', () => {
          console.log('Producer closed for consumer');
          socket.emit('producer-closed', { remoteProducerId });
  
          consumerTransport.close([]);
          transports = transports.filter(transportData => transportData.transport.id !== consumerTransport.id);
          consumer.close();
          consumers = consumers.filter(consumerData => consumerData.consumer.id !== consumer.id);
        });
  
        // Add the consumer to the list
        addConsumer(consumer, roomName);
  
        const params = {
          id: consumer.id,
          producerId: remoteProducerId,
          kind: consumer.kind,
          rtpParameters: consumer.rtpParameters,
          serverConsumerId: consumer.id,
        };
  
        console.log(`Sending consumer params to client:`, params);
  
        callback({ params });
      } else {
        console.error(`Router cannot consume producer ${remoteProducerId}`);
        callback({
          params: {
            error: `Router cannot consume producer ${remoteProducerId}`
          }
        });
      }
    } catch (error) {
      console.error(`Error in 'consume' event handler: ${error.message}`, error);
      callback({
        params: {
          error: error.message
        }
      });
    }
  });
  

  socket.on('consumer-resume', async ( serverConsumerId ) => {
    console.log('consumer resume')
    let targetConsumer = consumers.find(consumerData => consumerData.consumer.id === serverConsumerId);
    console.log(serverConsumerId)
    console.log(targetConsumer, consumers);
    const { consumer } = consumers.find(consumerData => consumerData.consumer.id === serverConsumerId)
    await consumer.resume()
  })
})

server.listen(port, () => {
  console.log(`Server is running on 192.168.68.115${port}`);
});
