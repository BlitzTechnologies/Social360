// Creates a room for devices to connect to.
const createRoom = async (rooms, roomName, socketId, worker, mediaCodecs) => {
    let router1
    let peers = []
    if (rooms[roomName]) {
        console.log('room exists', rooms[roomName])
        router1 = rooms[roomName].router
        peers = rooms[roomName].peers || []
    } else {
        router1 = await worker.createRouter({ mediaCodecs, })
    }

    console.log(`Router ID: ${router1.id}`, peers.length)

    rooms[roomName] = {
        router: router1,
        peers: [...peers, socketId],
    }

    return router1
}

// Creates a new peer, usually used after creating room.
const createPeer = (peers, socket, roomName) => {
    peers[socket.id] = {
        socket,
        roomName,
        transports: [],
        producers: [],
        consumers: [],
        peerDetails: {
            name: '',
        }
    }

    return peers;
}

// Creates a webRTCTransport object, reuturned in a promise.
const createWebRtcTransport = async (router) => {
    return new Promise(async (resolve, reject) => {
        try {
            // https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportOptions
            const webRtcTransport_options = {
                listenIps: [
                    {
                        ip: '192.168.68.115', // replace with relevant IP address
                    }
                ],
                enableUdp: true,
                enableTcp: true,
                preferUdp: true,
            }

            // https://mediasoup.org/documentation/v3/mediasoup/api/#router-createWebRtcTransport
            let transport = await router.createWebRtcTransport(webRtcTransport_options)
            console.log(`transport id: ${transport.id}`)

            transport.on('dtlsstatechange', dtlsState => {
                if (dtlsState === 'closed') {
                    transport.close()
                }
            })

            transport.on('close', () => {
                console.log('transport closed')
            })

            resolve(transport)

        } catch (error) {
            reject(error)
        }
    })
}

// adds a new transport to the transport list.
const addTransport = (transports, peers, socket, transport, roomName, consumer) => {

    transports.push({ socketId: socket.id, transport, roomName, consumer, });

    peers[socket.id] = {
        ...peers[socket.id],
        transports: [
            ...peers[socket.id].transports,
            transport.id,
        ]
    }
}

const getTransport = (transports, socketId) => {
    try {
        const [producerTransport] = transports.filter(transport => transport.socketId === socketId && !transport.consumer);
        if (!producerTransport) {
            console.log(`Transport not found for socketId: ${socketId}`);
            return null;
        }
        return producerTransport.transport;
    } catch (error) {
        console.log(`Error in getTransport: ${error.message}`);
        return null;
    }
};

const addProducer = (socket, producers, peers, producer, roomName) => {
    producers.push({ socketId: socket.id, producer, roomName, })

    peers[socket.id] = {
      ...peers[socket.id],
      producers: [
        ...peers[socket.id].producers,
        producer.id,
      ]
    }
  }

  const informConsumers = (producers, peers, roomName, socketId, id) => {
    console.log(`just joined, id ${id} ${roomName}, ${socketId}`)
    // A new producer just joined
    // let all consumers to consume this producer
    producers.forEach(producerData => {
      if (producerData.socketId !== socketId && producerData.roomName === roomName) {
        const producerSocket = peers[producerData.socketId].socket
        // use socket to send producer id to producer
        producerSocket.emit('new-producer', { producerId: id })
      }
    })
  }


module.exports = {
    createRoom,
    createPeer,
    createWebRtcTransport,
    addTransport,
    getTransport,
    addProducer,
    informConsumers,
}