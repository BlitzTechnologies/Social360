const User = require("../models/User");

class UserMapper {
    // Converts a plain object to a User instance
    static fromObject(obj) {
        if (!obj || typeof obj !== 'object') {
            throw new Error('Invalid input: must be an object');
        }
        const user = new User();
        user.uuid = obj.uuid || '',
        user.fullName = obj.fullName || '';
        user.username = obj.username || '';
        user.email = obj.email || '';
        user.password = obj.password || '';
        return user;
    }

    // Converts a User instance to a plain object
    static toObject(user) {
        if (!(user instanceof User)) {
            throw new Error('Invalid input: must be an instance of User');
        }
        return {
            uuid: user.uuid,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            password: user.password,
        };
    }
}

module.exports = {
    UserMapper
};
