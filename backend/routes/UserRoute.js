const express = require('express');
const router = express.Router();
const userRepository = require('../repositories/UserRepository');
const { validateRegisterUser, hashPassword } = require('../modules/accounts/UserHelper');
const { UserMapper } = require('../mappers/AccountMapper');
const { validateToken } = require('../modules/AuthHelper');
const { UserRole } = require('../models/enum');
const { generateUUID } = require('../modules/commonUtils/uuidGenerater');


router.get('/', async (req, res) => {
  const users = await userRepository.getAllUsers();
  res.json(users);
});

router.get('/:id', (req, res) => {
  const user = userRepository.getUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
});

router.post('/', async (req, res) => {
  let reqObj = req.body;
  let status = validateRegisterUser(req.body);
  if (!status.valid) {
    return res.status(400).json({ message: status.errors })

  }
  const query = {
    $or:
      [
        { username: reqObj.username },
        { email: reqObj.email }
      ]

  };
  const result = await userRepository.getOneUserByQuery(query);
  if (result !== null) {
    return res.status(400).json({ message: "username or email already exists" })
  }
  try {
    let hashedPassword = await hashPassword(reqObj.password);
    let userModel = UserMapper.fromObject(reqObj);
    userModel.uuid = generateUUID();
    userModel.password = hashedPassword;
    userModel.role = UserRole.USER;
    const newUser = await userRepository.createUser(userModel);
    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
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
