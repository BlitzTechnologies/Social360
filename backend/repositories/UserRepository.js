// Mock implementation for illustration
const users = [];

class UserRepository {
  getAllUsers() {
    return users;
  }

  getUserById(id) {
    return users.find(user => user.id === id);
  }

  createUser(user) {
    users.push(user);
    return user;
  }

  updateUser(id, updatedUser) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedUser };
      return users[index];
    }
    return null;
  }

  deleteUser(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      const deletedUser = users.splice(index, 1);
      return deletedUser;
    }
    return null;
  }
}

module.exports = new UserRepository();
