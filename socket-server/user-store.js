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

  reconnectWithToken(token, socketId) {
    let user = this.getDisconnectedUserByToken(token);

    if (user) {
      user.socketId = socketId;
      this.connectedUsers[user.username] = user;
      delete this.disconnectedUsers[user.username];
      return new LoginResponse(user);
    } else {
      return new InvalidLoginResponse();
    }
  }

  getUserBySocketId(socketId) { //TODO: GJ: tests
    return Object.values(this.connectedUsers).find(u => u.socketId === socketId);
  }

  getDisconnectedUserBySocketId(socketId) { //TODO: GJ: tests
    return Object.values(this.disconnectedUsers).find(u => u.socketId === socketId);
  }

  getDisconnectedUserByToken(token) { //TODO: GJ: tests
    return Object.values(this.disconnectedUsers).find(u => u.token === token);
  }

  getUsersByRole(role) { //TODO: GJ: tests
    return Object.values(this.connectedUsers).filter(u => u.role === role);
  }

  getUsersByMetadata(key, value) { //TODO: getUsersWithMetadataValue
    return Object.values(this.connectedUsers).filter(u => u.hasMetadataValue(key, value));
  }

  getUsersWithMetadata(key) {
    return Object.values(this.connectedUsers).filter(u => u.hasMetadata(key));
  }

  clearMetadataByValue(key, value) {
    let users = this.getUsersByMetadata(key, value);
    users.forEach((user) => user.clearMetadata(key));
    return users; //TODO: test
  }

  mergeUserMetadata(socketId, metadata) {
    let user = this.getUserBySocketId(socketId);
    if (user) {
      return user.mergeMetadata(metadata);
    }
  }

  getMetadataSummary(key) {
    let counts = {};
    let usersWithKey = 0;

    Object.values(this.connectedUsers).forEach((user) => {
      let value = user.metadata[key];

      if (value !== undefined) {
        usersWithKey++;
        if (counts[value] === undefined) {
          counts[value] = 1;
        } else {
          counts[value]++;
        }
      }
    });

    return {
      count: usersWithKey,
      counts
    };
  }

  get connectedUserCount() {
    return Object.keys(this.connectedUsers).length;
  }

  get connectedAudienceCount() {
    return this.getUsersByRole('audience').length;
  }

  get disconnectedUserCount() {
    return Object.keys(this.disconnectedUsers).length;
  }

  get summary() { //TODO: tests
    return {
      connectedUserCount: this.connectedUserCount,
      connectedAudienceCount: this.connectedAudienceCount,
      disconnectedUserCount: this.disconnectedUserCount,
    }
  }

  get users() { //TODO: tests and decide on payload format
    return {
      connectedUsers: this.connectedUsers,
      disconnectedUsers: this.disconnectedUsers
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

  hasMetadata(key) {
    return this.metadata[key] !== undefined;
  }

  hasMetadataValue(key, value) {
    return this.metadata[key] === value;
  }

  clearMetadata(key) {
    delete this.metadata[key];
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
