const UserStore = require('./user-store');
const http = require('http').Server(this.app);
const io = require('socket.io')(http);

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
      });

      socket.on('disconnect', () => {
        console.log('SOCKET DISCONNECT', socket.id);
        this.userStore.disconnect(socket.id);
      });

      socket.on('updateUserMetaData', (data) => {
        let metadata = this.userStore.mergeUserMetadata(socket.id, data);
        socket.emit('userMetadataUpdated', metadata);

        Object.keys(data).forEach((key) => { //TODO: GJ: config roles
          this.emitToRole('screen', `users.metadata.${key}.summary`, this.userStore.getMetadataSummary(key));
        });
      }),

      socket.on('latencyPing', function(data) {
        data.serverTime = Date.now();
        socket.emit('latencyPong', data);
      });

      //TODO: lock down to presenter role
      socket.on('goToSlide', (data) => {
        this.currentSlide = data.slide;
        io.emit('goToSlide', data);
      });

      socket.on('getMetadataSummary', (key, callback) => {
        callback(this.userStore.getMetadataSummary(key));
      }),

      socket.on('getUserStatistics', (callback) => {
        callback(this.userStore.summary);
      });

      socket.on('getUsers', (callback) => {
        callback(this.userStore.users);
      }),

      socket.on('setInitialSlideState', () => {
        if (this.currentSlide) {
          socket.emit('goToSlide', { slide: this.currentSlide });
        }
      });

      socket.on('broadcast', function({ name, data }) {
        data = data || {};
        data.serverTime = Date.now();
        io.emit(name, data);
      });
    });
  }

  emitToRole(role, name, data) { //TODO: GJ: use rooms for this?
    let users = this.userStore.getUsersByRole(role);
    users.forEach((user) => {
      let socket = io.sockets.connected[user.socketId];
      if (socket) {
        socket.emit(name, data);
      }
    });
  }
};
