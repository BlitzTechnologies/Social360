const constants = require('./constants');
const { verify } = require('jsonwebtoken');

// Validate login data
function validateLogin(reqObj) {
    const { usernameEmail , password } = reqObj;

    const errors = [];

    if (!usernameEmail) {
        errors.push('Username or email is required.');
    }

    if (!password) {
        errors.push('Password is required.');
    }

    // Return validation result
    return {
        valid: errors.length === 0,
        errors: errors
    };
}

const validateToken = (req, res, next) => {
    try {
      const accessToken = req.header("Authorization").split(" ")[1];
      if (!accessToken) {
        return res.sendStatus(401);
      }
  
      req.user = verify(accessToken, constants.APP_SECRET);
      return next();
    }
    catch (err) {
      return res.sendStatus(401);
    }
  }

module.exports = {
    validateLogin,
    validateToken
};
