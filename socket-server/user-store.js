const uuidv4 = require('uuid/v4');

module.exports = class UserStore {
  constructor(config) {
    this.config = new Configuration(config);
    this.connectedUsers = {};
    this.disconnectedUsers = {};
  }

  login(username, password, socketId) {
    let existingUser = this.connectedUsers[username];
    if (existingUser) {
      return new InvalidLoginResponse();
    }

    let user;
    if (password) {
      let role = this.config.getRoleByPassword(password);

      if (!role) {
        return new InvalidLoginResponse();
      }

      user = new User(username, role, socketId);
    } else {
      user = new User(username, 'audience', socketId);
    }

    this.connectedUsers[username] = user;
    return new LoginResponse(user);
  }

  disconnect(socketId) {
    let user = this.getUserBySocketId(socketId);

    if (user) {
      this.disconnectedUsers[user.username] = user;
      delete this.connectedUsers[user.username];
    }
  }

  getUserBySocketId(socketId) { //TODO: GJ: tests
    return Object.values(this.connectedUsers).find(u => u.socketId === socketId);
  }

  getUsersByRole(role) { //TODO: GJ: tests
    return Object.values(this.connectedUsers).filter(u => u.role === role);
  }

  mergeUserMetadata(socketId, metadata) {
    let user = this.getUserBySocketId(socketId);
    if (user) {
      return user.mergeMetadata(metadata);
    }
  }

  get connectedUserCount() {
    return Object.keys(this.connectedUsers).length;
  }

  get disconnectedUserCount() {
    return Object.keys(this.disconnectedUsers).length;
  }

  get summary() { //TODO: tests
    return {
      connectedUserCount: this.connectedUserCount,
      disconnectedUserCount: this.disconnectedUserCount,
    }
  }

  get users() { //TODO: tests and decide on payload format
    return {
      connectedUsers: this.connectedUsers
    }
  }
};

class Configuration {
  constructor(config) {
    this.config = config;
  }

  getRoleByPassword(password) {
    let roles = this.config.roles;
    let role = Object.keys(roles).find(role => roles[role].password === password);
    return role;
  }
}

class User {
  constructor(username, role, socketId) {
    this.username = username;
    this.role = role;
    this.socketId = socketId;
    this.metadata = {};
    this.token = uuidv4();
  }

  mergeMetadata(metadata) {
    return Object.assign(this.metadata, metadata);
  }
}

class LoginResponse {
  constructor(user) {
    this.user = user;
    this.isSuccess = !!user;
  }
}

class InvalidLoginResponse extends LoginResponse {
  constructor() {
    super();
  }
}
