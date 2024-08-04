const express = require('express');
const router = express.Router();
const userRepository = require('../repositories/UserRepository');
const { validateRegisterUser, hashPassword } = require('../modules/accounts/UserHelper');
const { MONGO_DB_COLLECTIONS } = require('../modules/constants');
const { UserMapper } = require('../mappers/AccountMapper');
const { validateToken } = require('../modules/AuthHelper');


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
    let userModel = UserMapper.fromObject(reqObj);
    userModel.password = hashedPassword;
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
  let userList = await userRepository.getAllUsers(MONGO_DB_COLLECTIONS.ACCOUNT_COLLECTION)
  if (userList.some(user => user.username === reqObj.username)) {
    return res.status(400).json({ message: "username already exists" })
  }
  return res.status(200).json({ message: "username is unique" })
});

// route for on blur when filling in email
router.post('/check/email', async (req, res) => {
  let reqObj = req.body;
  let userList = await userRepository.getAllUsers(MONGO_DB_COLLECTIONS.ACCOUNT_COLLECTION)
  if (userList.some(user => user.email === reqObj.email)) {
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
