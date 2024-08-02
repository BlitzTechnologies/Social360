const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { validateLogin } = require('../modules/AuthHelper');
const UserRepository = require('../repositories/UserRepository');
const constants = require('../modules/constants');
const bcrypt = require('bcrypt');


router.post('/login', async (req, res) => {
  let reqObj = req.body;
  const validation = validateLogin(reqObj);

  if (!validation.valid) {
    return res.status(400).json({ errors: validation.errors });
  }

  const { usernameEmail, password } = reqObj

  try {

    const userList = await UserRepository.getAllUsers();
    const user = userList.find(user => user.username === usernameEmail.trim() || user.email === usernameEmail.trim());
    if (!user) {
      return res.status(400).json({ message: "username/email or password invalid" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "username/email or password invalid" });
    }

    const token = jwt.sign(
      { username: user.username, email: user.email },
      constants.APP_SECRET,
      { expiresIn: constants.TOKEN_EXPIRES_IN }
    );

    return res.status(200).json({
      message: 'Login successful',
      user: { username: user.username, email: user.email },
      token: token
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
