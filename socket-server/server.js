const UserStore = require('./user-store');
const throttleWithArgs = require('./throttle-with-args');
const http = require('http').Server(this.app);
const io = require('socket.io')(http);

function getRandomItem(items) {
  return items[Math.floor(Math.random()*items.length)];
}

module.exports = class SocketServer {
  constructor(app, configuration) {
    this.app = app;
    this.configuration = configuration;

    this.userStore = new UserStore(configuration);
    this.currentSlide; //TODO: extract to state class

    this.throttledEmitToRole = throttleWithArgs((...args) => this.emitToRole.apply(this, args));
  }

  start() {
    http.listen(this.configuration.socketServerPort, () => {
      console.log('socket server listening on *:' + this.configuration.socketServerPort);
    });

    io.on('connection', (socket) => {
      console.log('SOCKET CONNECT', socket.id);

      socket.on('login', (data, callback) => {
        let response = this.userStore.login(data.username, data.password, socket.id);
        response.currentSlide = this.currentSlide;
        callback(response);

        this.throttledEmitToControllers('userStastics', this.userStore.summary);
      });

      socket.on('reconnectWithToken', (data, callback) => {
        let response = this.userStore.reconnectWithToken(data.token, socket.id);
        response.currentSlide = this.currentSlide;
        callback(response);

        this.throttledEmitToControllers('userStastics', this.userStore.summary);
      }),

      socket.on('disconnect', () => {
        if (socket) {
          console.log('SOCKET DISCONNECT', socket.id);
          this.userStore.disconnect(socket.id);

          this.throttledEmitToControllers('userStastics', this.userStore.summary);
        }
      });

      socket.on('updateUserMetadata', (data) => { //TODO: review API
        let socketId = data.socketId || socket.id; //TODO: GJ: lock down to role
        delete data.socketId;

        let userSocket = this.getSocket(socketId);

        if (userSocket) {
          let metadata = this.userStore.mergeUserMetadata(socketId, data);
          userSocket.emit('userMetadataUpdated', metadata);

          Object.keys(data).forEach((key) => {
            this.throttledEmitToControllers(`users.metadata.${key}.counts`, this.userStore.getMetadataCounts(key));
          });
        }
      }),

      socket.on('latencyPing', function(data) {
        data.serverTime = Date.now();
        socket.emit('latencyPong', data);
      });

      socket.on('goToSlide', (data) => {
        if (!this.canControlPresentation(socket)) {
          return;
        }
        this.currentSlide = data.slide;
        io.emit('goToSlide', data);
      });

      socket.on('getMetadataSummary', (key, callback) => {
        if (!this.canControlPresentation(socket)) {
          return;
        }
        callback(this.userStore.getMetadataSummary(key));
      }),

      socket.on('getMetadataCounts', (key, callback) => {
        if (!this.canControlPresentation(socket)) {
          return;
        }
        callback(this.userStore.getMetadataCounts(key));
      }),

      socket.on('getUserStatistics', (callback) => {
        if (!this.canControlPresentation(socket)) {
          return;
        }
        callback(this.userStore.summary);
      });

      socket.on('getUsers', (callback) => {
        if (!this.canControlPresentation(socket)) {
          return;
        }
        callback(this.userStore.users);
      }),

      socket.on('getRandomUserWithMetadata', (key, value, callback) => {
        if (!this.canControlPresentation(socket)) {
          return;
        }

        let matchingUsers = this.userStore.getUsersByMetadata(key, value);
        let user = getRandomItem(matchingUsers);
        callback(user);
      }),

      socket.on('getUsersWithMetadata', (key, callback) => {
        if (!this.canControlPresentation(socket)) {
          return;
        }

        let users = this.userStore.getUsersWithMetadata(key);
        callback({ users });
      }),

      socket.on('clearMetadataByValue', (key, value) => {
        if (!this.canControlPresentation(socket)) {
          return;
        }

        let users = this.userStore.clearMetadataByValue(key, value);

        //TODO: GJ: emit `userMetadataUpdated` for any users which had the metadata
        users.forEach((user) => {
          let userSocket = this.getSocket(user.socketId);
          if (userSocket) {
            userSocket.emit('userMetadataUpdated', user.metadata);
          }
        });

        this.throttledEmitToControllers(`users.metadata.${key}.summary`, this.userStore.getMetadataSummary(key));
      });

      socket.on('setInitialSlideState', () => {
        if (!this.canControlPresentation(socket)) {
          return;
        }

        if (this.currentSlide) {
          socket.emit('goToSlide', { slide: this.currentSlide });
        }
      });

      socket.on('broadcast', ({ name, data }) => { //TODO: GJ: change from hash to arguments
        data = data || {};
        data.serverTime = Date.now();
        io.emit(name, data);
      });

      socket.on('broadcastToRole', ({ role, name, data }) => { //TODO: GJ: change from hash to arguments
        data = data || {};
        data.serverTime = Date.now();
        this.emitToRole(role, name, data);
      });
    });
  }

  canControlPresentation(socket) {
    let user = this.userStore.getUserBySocketId(socket.id);
    if (user) {
      let roleConfigration = this.configuration.roles[user.role];
      if (roleConfigration && roleConfigration.canControlPresentation) {
        return true;
      }
    }

    return false;
  }

  throttledEmitToControllers(name, data) {
    Object.values(this.configuration.roles).forEach((role) => {
      if (role.canControlPresentation) {
        this.throttledEmitToRole(role.name, name, data)
      }
    });
  }

  emitToRole(role, name, data) {
    let users = this.userStore.getUsersByRole(role);
    users.forEach((user) => {
      let socket = this.getSocket(user.socketId);
      if (socket) {
        socket.emit(name, data);
      }
    });
  }

  getSocket(socketId) {
    return io.sockets.connected[socketId];
  }
};
