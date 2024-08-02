const { insertDocument } = require("../services/db");

// Mock implementation for illustration
const users = [];

class UserRepository {
  async getAllUsers() {
    return users;
  }

  async getUserById(id) {
    return users.find(user => user.id === id);
  }

  async createUser(user) {
    const response = await insertDocument(user, "Accounts")
    return response;
  }

  async updateUser(id, updatedUser) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedUser };
      return users[index];
    }
    return null;
  }

  async deleteUser(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      const deletedUser = users.splice(index, 1);
      return deletedUser;
    }
    return null;
  }
}

module.exports = new UserRepository();
