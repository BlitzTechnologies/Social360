const constants = require("../modules/constants");
const { insertDocument, findAllDocuments, findOneDocument, findMultipleDocuments } = require("../services/db");

// Mock implementation for illustration
const users = [];

class RoomRepository {

  async create(model) {
    const response = await insertDocument(model, constants.MONGO_DB_COLLECTIONS.ROOM_COLLECTION)
    return response;
  }

  async getAll() {
    const response = await findAllDocuments(constants.MONGO_DB_COLLECTIONS.ROOM_COLLECTION)
    return response;
  }

  async getOneByQuery(query) {
    const response = await findOneDocument(query, constants.MONGO_DB_COLLECTIONS.ROOM_COLLECTION)
    return response;
  }

  async getMultipleByQuery(query) {
    const response = await findMultipleDocuments(query, constants.MONGO_DB_COLLECTIONS.ROOM_COLLECTION)
    return response;
  }

  async getById(id) {
    return users.find(user => user.id === id);
  }

  async update(id, updatedUser) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedUser };
      return users[index];
    }
    return null;
  }

  async delete(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      const deletedUser = users.splice(index, 1);
      return deletedUser;
    }
    return null;
  }
}

module.exports = new RoomRepository();
