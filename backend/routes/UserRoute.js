const express = require('express');
const router = express.Router();
const userRepository = require('../repositories/UserRepository');
const { validateRegisterUser, hashPassword } = require('../modules/accounts/userHelper');
const { MONGO_DB_COLLECTIONS } = require('../modules/constants');
const User = require('../models/User');


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
  let userList = await userRepository.getAllUsers(MONGO_DB_COLLECTIONS.ACCOUNT_COLLECTION)
  // ensure no duplicate emails/ username
  if (userList.some(user => user.username === reqObj.username || user.email === reqObj.email)) {
    return res.status(400).json({ message: "username or email already exists" })
  }
  try {
    let hashedPassword = await hashPassword(reqObj.password);
    let userModel = new User(reqObj.username, reqObj.email, hashedPassword)
    const newUser = await userRepository.createUser(userModel);
    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
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
