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

  get connectedUserCount() {
    return Object.keys(this.connectedUsers).length;
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
    this.token = uuidv4();
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
