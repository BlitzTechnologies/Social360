const validator = require('validator');

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

module.exports = {
    validateLogin
};
