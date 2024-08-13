const { Server } = require('socket.io');
const mediasoup = require('mediasoup');
const {
  createRoom,
  createPeer,
  createWebRtcTransport,
  addTransport,
  getTransport,
  addProducer,
  informConsumers,
} = require('./VideoHelper.js');

let worker;
let rooms = {};
let peers = {};
let transports = [];
let producers = [];
let consumers = [];

const createWorker = async () => {
  worker = await mediasoup.createWorker({
    rtcMinPort: 2000,
    rtcMaxPort: 2100,
  });
  console.log(`worker pid ${worker.pid}`);

  worker.on('died', () => {
    console.error('mediasoup worker has died');
    setTimeout(() => process.exit(1), 2000); // exit in 2 seconds
  });

  return worker;
};

// Initialize the worker
worker = createWorker();

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
];

const initializeSocketIOMediasoup = (server) => {
  const IO = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  const connections = IO.of('/mediasoup');

  connections.on('connection', async (socket) => {
    console.log(socket.id);
    socket.emit('connection-success', {
      socketId: socket.id,
    });

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
            peers: rooms[targetRoomName].peers.filter(socketId => socketId !== socket.id),
          };
        }
      } else {
        console.log('Peer not found for socket.id:', socket.id);
      }
    });

    socket.on('joinRoom', async ({ roomName }, callback) => {
      console.log("roomname:'", roomName);
      const router1 = await createRoom(rooms, roomName, socket.id, worker, mediaCodecs);
      createPeer(peers, socket, roomName);

      console.log("created room peers", peers);

      const rtpCapabilities = router1.rtpCapabilities;
      callback({ rtpCapabilities });
    });

    socket.on('getRtpCapabilities', (callback) => {
      const rtpCapabilities = router.rtpCapabilities;
      console.log('rtp Capabilities', rtpCapabilities);
      callback({ rtpCapabilities });
    });

    socket.on('createWebRtcTransport', async ({ consumer }, callback) => {
      const roomName = peers[socket.id].roomName;
      const router = rooms[roomName].router;

      createWebRtcTransport(router).then(
        transport => {
          callback({
            params: {
              id: transport.id,
              iceParameters: transport.iceParameters,
              iceCandidates: transport.iceCandidates,
              dtlsParameters: transport.dtlsParameters,
            },
          });

          addTransport(transports, peers, socket, transport, roomName, consumer);
        },
        error => {
          console.log(error);
        }
      );
    });

    const addConsumer = (consumer, roomName) => {
      consumers = [...consumers, { socketId: socket.id, consumer, roomName }];
      peers[socket.id] = {
        ...peers[socket.id],
        consumers: [...peers[socket.id].consumers, consumer.id],
      };
    };

    socket.on('getProducers', callback => {
      const { roomName } = peers[socket.id];
      let producerList = [];
      producers.forEach(producerData => {
        if (producerData.socketId !== socket.id && producerData.roomName === roomName) {
          producerList = [...producerList, producerData.producer.id];
        }
      });

      callback(producerList);
    });

    socket.on('transport-connect', ({ dtlsParameters }) => {
      console.log('DTLS PARAMS... ', { dtlsParameters });

      let targetTransport = getTransport(transports, socket.id);
      if (targetTransport) {
        console.log('transport connect success, target transport: ', targetTransport);
        targetTransport.connect({ dtlsParameters });
        return;
      }
      console.log('target transport not found');
    });

    socket.on('transport-produce', async ({ kind, rtpParameters, appData }, callback) => {
      const producer = await getTransport(transports, socket.id).produce({
        kind,
        rtpParameters,
      });

      const { roomName } = peers[socket.id];
      addProducer(socket, producers, peers, producer, roomName);
      informConsumers(producers, peers, roomName, socket.id, producer.id);

      console.log('Producer ID: ', producer.id, producer.kind);

      producer.on('transportclose', () => {
        console.log('transport for this producer closed ');
        producer.close();
      });

      callback({
        id: producer.id,
        producersExist: producers.length > 1 ? true : false,
      });
    });

    socket.on('transport-recv-connect', async ({ dtlsParameters, serverConsumerTransportId }) => {
      console.log(`DTLS PARAMS: ${dtlsParameters}`);
      const consumerTransport = transports.find(transportData => (
        transportData.consumer && transportData.transport.id == serverConsumerTransportId
      )).transport;
      await consumerTransport.connect({ dtlsParameters });
    });

    socket.on('consume', async ({ rtpCapabilities, remoteProducerId, serverConsumerTransportId }, callback) => {
      try {
        console.log(`Consume request received:`, { rtpCapabilities, remoteProducerId, serverConsumerTransportId });

        const { roomName } = peers[socket.id];
        const router = rooms[roomName].router;
        console.log(`Room Name: ${roomName}, Router ID: ${router.id}`);

        let consumerTransport = transports.find(transportData => (
          transportData.consumer && transportData.transport.id == serverConsumerTransportId
        )).transport;

        if (!consumerTransport) {
          console.error(`Consumer transport with ID ${serverConsumerTransportId} not found`);
          return callback({
            params: {
              error: `Consumer transport with ID ${serverConsumerTransportId} not found`,
            },
          });
        }

        console.log(`Consumer transport found: ${consumerTransport.id}`);

        if (router.canConsume({
          producerId: remoteProducerId,
          rtpCapabilities,
        })) {
          console.log(`Router can consume producer ${remoteProducerId}`);

          const consumer = await consumerTransport.consume({
            producerId: remoteProducerId,
            rtpCapabilities,
            paused: true,
          });

          console.log(`Consumer created: ${consumer.id}, kind: ${consumer.kind}`);

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
              error: `Router cannot consume producer ${remoteProducerId}`,
            },
          });
        }
      } catch (error) {
        console.error(`Error in 'consume' event handler: ${error.message}`, error);
        callback({
          params: {
            error: error.message,
          },
        });
      }
    });

    socket.on('consumer-resume', async (serverConsumerId) => {
      console.log('consumer resume');
      let targetConsumer = consumers.find(consumerData => consumerData.consumer.id === serverConsumerId);
      console.log(serverConsumerId);
      console.log(targetConsumer, consumers);
      const { consumer } = consumers.find(consumerData => consumerData.consumer.id === serverConsumerId);
      await consumer.resume();
    });
  });
};

module.exports = initializeSocketIOMediasoup;
