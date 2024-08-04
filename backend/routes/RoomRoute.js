const express = require('express');
const router = express.Router();
const userRepository = require('../repositories/UserRepository');
const RoomRepository = require('../repositories/RoomRepository');
const { validateCreateRoom, generateRoomCode } = require('../modules/rooms/RoomHelper');
const { RoomMapper } = require('../mappers/RoomMapper');
const { generateUUID } = require('../modules/commonUtils/uuidGenerater');


router.get('/', async (req, res) => {
    const response = await RoomRepository.getAll();
    res.json(response);
});

router.get('/:id', async (req, res) => {
    const reqId = req.params.id
    const response = await RoomRepository.getById(reqId);
    if (response) {
        res.json(response);
    } else {
        res.status(404).send('Room not found');
    }
});

router.post('/', async (req, res) => {
    let reqObj = req.body;
    await validateCreateRoom.validate(reqObj)
        .catch(err => {
            console.log("error", err)
            return res.status(400).json({ message: err.errors })
        });
    try {
        let roomCode = generateRoomCode();
        let roomModel = RoomMapper.fromObject(reqObj);
        roomModel.uuid = generateUUID();
        roomModel.code = roomCode;
        roomModel.host = reqObj.createdBy;
        roomModel.participants = [reqObj.createdBy];
        const newObj = await RoomRepository.create(roomModel);
        return res.status(201).json(newObj);
    } catch (error) {
        console.error("Error creating room:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// route for on blur when filling in username
router.post('/check/username', async (req, res) => {
    let reqObj = req.body;
    const query = {
        username: reqObj.username
    };
    const result = await userRepository.getOneUserByQuery(query);
    if (result !== null) {
        return res.status(400).json({ message: "username already exists" })
    }
    return res.status(200).json({ message: "username is unique" })
});

// route for on blur when filling in email
router.post('/check/email', async (req, res) => {
    let reqObj = req.body;
    const query = {
        email: reqObj.email
    };
    const result = await userRepository.getOneUserByQuery(query);
    if (result !== null) {
        return res.status(400).json({ message: "email already exists" })
    }
    return res.status(200).json({ message: "email is unique" })
});

router.put('/:id', (req, res) => {
    const updatedUser = userRepository.updateUser(req.params.id, req.body);
    if (updatedUser) {
        res.json(updatedUser);
    } else {
        res.status(404).send('User not found');
    }
});

router.delete('/:id', (req, res) => {
    const deletedUser = userRepository.deleteUser(req.params.id);
    if (deletedUser) {
        res.json(deletedUser);
    } else {
        res.status(404).send('User not found');
    }
});

module.exports = router;
