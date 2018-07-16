const UserStore = require('./user-store');
const http = require('http').Server(this.app);
const io = require('socket.io')(http);

function getRandomItem(items) {
  return items[Math.floor(Math.random()*items.length)];
}

//TODO: GJ: add try catch to ensure no crashers
module.exports = class SocketServer {
  constructor(app, configuration) {
    this.app = app;
    this.configuration = configuration;

    this.userStore = new UserStore(configuration);

    this.currentSlide; //TODO: extract to state class
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

        this.emitToRole('screen', 'userStastics', this.userStore.summary); //TODO: GJ: config roles
        this.emitToRole('ableton', 'userStastics', this.userStore.summary); //TODO: GJ: config roles
      });

      socket.on('reconnectWithToken', (data, callback) => {
        let response = this.userStore.reconnectWithToken(data.token, socket.id);
        response.currentSlide = this.currentSlide;
        callback(response);

        this.emitToRole('screen', 'userStastics', this.userStore.summary); //TODO: GJ: config roles
        this.emitToRole('ableton', 'userStastics', this.userStore.summary); //TODO: GJ: config roles
      }),

      socket.on('disconnect', () => {
        if (socket) {
          console.log('SOCKET DISCONNECT', socket.id);
          this.userStore.disconnect(socket.id);

          this.emitToRole('screen', 'userStastics', this.userStore.summary); //TODO: GJ: config roles
          this.emitToRole('ableton', 'userStastics', this.userStore.summary); //TODO: GJ: config roles
        }
      });

      socket.on('updateUserMetaData', (data) => { //TODO: rename to updateUserMetadata and review API
        let socketId = data.socketId || socket.id; //TODO: GJ: lock down to role
        delete data.socketId;

        let userSocket = this.getSocket(socketId);
        if (userSocket) {
          let metadata = this.userStore.mergeUserMetadata(socketId, data);
          userSocket.emit('userMetadataUpdated', metadata);
        }
      }),

      socket.on('latencyPing', function(data) {
        data.serverTime = Date.now();
        socket.emit('latencyPong', data);
      });

      socket.on('goToSlide', (data) => {
        if (!this.hasRole(socket, ['presenter', 'screen', 'ableton'])) {
          return;
        }
        this.currentSlide = data.slide;
        io.emit('goToSlide', data);
      });

      socket.on('getMetadataSummary', (key, callback) => {
        if (!this.hasRole(socket, ['presenter', 'screen', 'ableton'])) {
          return;
        }
        callback(this.userStore.getMetadataSummary(key));
      }),

      socket.on('getUserStatistics', (callback) => {
        if (!this.hasRole(socket, ['presenter', 'screen', 'ableton'])) {
          return;
        }
        callback(this.userStore.summary);
      });

      socket.on('getUsers', (callback) => {
        if (!this.hasRole(socket, ['presenter', 'screen', 'ableton'])) {
          return;
        }
        callback(this.userStore.users);
      }),

      socket.on('getRandomUserWithMetadata', (key, value, callback) => {
        if (!this.hasRole(socket, ['presenter', 'screen', 'ableton'])) {
          return;
        }

        let matchingUsers = this.userStore.getUsersByMetadata(key, value);
        let user = getRandomItem(matchingUsers);
        callback(user);
      }),

      socket.on('getUsersWithMetadata', (key, callback) => {
        if (!this.hasRole(socket, ['presenter', 'screen', 'ableton'])) {
          return;
        }

        let users = this.userStore.getUsersWithMetadata(key);
        callback({ users });
      }),

      socket.on('clearMetadataByValue', (key, value) => {
        if (!this.hasRole(socket, ['presenter', 'screen', 'ableton'])) {
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

        //TODO: GJ: config roles and extract commonality
        this.emitToRole('screen', `users.metadata.${key}.summary`, this.userStore.getMetadataSummary(key));
        this.emitToRole('ableton', `users.metadata.${key}.summary`, this.userStore.getMetadataSummary(key));
      });

      socket.on('setInitialSlideState', () => {
        if (!this.hasRole(socket, ['presenter', 'screen', 'ableton'])) {
          return;
        }

        if (this.currentSlide) {
          socket.emit('goToSlide', { slide: this.currentSlide });
        }
      });

      socket.on('broadcast', ({ name, data }) => { //TODO: GJ: change from hash to arguments
        if (!this.hasRole(socket, ['presenter', 'screen', 'ableton'])) {
          return;
        }

        data = data || {};
        data.serverTime = Date.now();
        io.emit(name, data);
      });

      socket.on('broadcastToRole', ({ role, name, data }) => { //TODO: GJ: change from hash to arguments
        if (!this.hasRole(socket, ['presenter', 'screen', 'ableton'])) {
          return;
        }

        data = data || {};
        data.serverTime = Date.now();
        this.emitToRole(role, name, data);
      });
    });
  }

  hasRole(socket, roles) {
    if (!socket) {
      return false;
    }

    if (!roles) {
      return false;
    }

    let user = this.userStore.getUserBySocketId(socket.id);

    if (user) {
      for (let i=0; i<roles.length; i++) {
        if (user.role === roles[i]) {
          return true;
        }
      }
    }

    return false;
  }

  emitToRole(role, name, data) { //TODO: GJ: use rooms for this
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
