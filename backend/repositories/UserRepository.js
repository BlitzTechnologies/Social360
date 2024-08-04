const constants = require("../modules/constants");
const { insertDocument, findAllDocuments, findOneDocument, findMultipleDocuments } = require("../services/db");

// Mock implementation for illustration
const users = [];

class UserRepository {

  async createUser(user) {
    const response = await insertDocument(user, constants.MONGO_DB_COLLECTIONS.ACCOUNT_COLLECTION)
    return response;
  }

  async getAllUsers() {
    const response = await findAllDocuments(constants.MONGO_DB_COLLECTIONS.ACCOUNT_COLLECTION)
    return response;
  }

  async getOneUserByQuery(query) {
    const response = await findOneDocument(query, constants.MONGO_DB_COLLECTIONS.ACCOUNT_COLLECTION)
    return response;
  }

  async getMultipleUsersByQuery(query) {
    const response = await findMultipleDocuments(query, constants.MONGO_DB_COLLECTIONS.ACCOUNT_COLLECTION)
    return response;
  }

  async getUserById(id) {
    return users.find(user => user.id === id);
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
