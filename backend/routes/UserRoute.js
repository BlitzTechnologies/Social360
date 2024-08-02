const express = require('express');
const router = express.Router();
const userRepository = require('../repositories/UserRepository');

router.get('/', (req, res) => {
  const users = userRepository.getAllUsers();
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
  console.log("Request Body:", req.body);
  try {
    const newUser = await userRepository.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: 'Internal Server Error' });
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
