const UserStore = require('./user-store');

module.exports = class SocketServer {
  constructor(app, configuration) {
    this.app = app;
    this.configuration = configuration;

    this.userStore = new UserStore(configuration);

    this.currentSlide; //TODO: extract to state class
  }

  start() {
    let http = require('http').Server(this.app);
    let io = require('socket.io')(http);

    http.listen(this.configuration.socketServerPort, () => {
      console.log('socket server listening on *:' + this.configuration.socketServerPort);
    });

    io.on('connection', (socket) => {
      console.log('GJ: SOCKET CONNECT', socket.id);

      socket.on('login', (data, callback) => {
        let response = this.userStore.login(data.username, data.password, socket.id);
        response.currentSlide = this.currentSlide;
        callback(response);
      });

      socket.on('disconnect', () => {
        console.log('GJ: SOCKET DISCONNECT', socket.id);
        this.userStore.disconnect(socket.id);
      });

      socket.on('updateUserMetaData', (data) => {
        let metadata = this.userStore.mergeUserMetadata(socket.id, data);
        socket.emit('userMetadataUpdated', metadata);

        //TODO: GJ: emit `userModified` for roles which allow it
        //TODO: GJ: extract
        let screenUsers = this.userStore.getUsersByRole('screen'); //TODO: GJ: roles that receive user update hints should be configurable
        screenUsers.forEach((user) => {
          let screenSocket = io.sockets.connected[user.socketId];
          if (screenSocket) {
            screenSocket.emit('userModified');
          }
        });
      }),

      //TODO: lock down to presenter role
      socket.on('goToSlide', (data) => {
        this.currentSlide = data.slide;
        io.emit('goToSlide', data);
      });

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
    });
  }
};
