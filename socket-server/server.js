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

        callback(response);
      });

      socket.on('disconnect', function() {
        console.log('GJ: SOCKET DISCONNECT', socket.id);
      });

      //TODO: lock down to presenter role
      socket.on('goToSlide', (data) => {
        this.currentSlide = data.slide;
        io.emit('goToSlide', data);
      });

      socket.on('setInitialSlideState', () => {
        if (this.currentSlide) {
          socket.emit('goToSlide', { slide: this.currentSlide });
        }
      });
    });
  }
};
