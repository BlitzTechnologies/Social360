
const validator = require('validator');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10; // Number of salt rounds

function validateRegisterUser(request) {
    const { username, email, password } = request;
    const errors = [];

    if (!username || typeof username !== 'string' || username.trim().length === 0) {
        errors.push('username is required and should be a non-empty string.');
    }

    if (!email || !validator.isEmail(email)) {
        errors.push('A valid email address is required.');
    }

    if (!password || !isValidPassword(password)) {
        errors.push('Password is required and must meet complexity requirements.');
    }

    if (errors.length > 0) {
        return { valid: false, errors };
    }
    return { valid: true };
}

function isValidPassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigits = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
        typeof password === 'string' &&
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasDigits &&
        hasSpecialChar
    );
}

async function hashPassword(password) {
    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        return hashedPassword;
    } catch (error) {
        console.error("Error hashing password:", error);
        throw error;
    }
}


module.exports = {
    validateRegisterUser,
    hashPassword
};