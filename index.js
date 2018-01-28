'use strict';

const DEFAULT_SOCKET_SERVER_PORT = 5200;

let currentSlide;

module.exports = {
  name: 'ember-present',

  included(app) {
    app.import('vendor/ember-present.css');
  },

  serverMiddleware: function(config) {
    let configPath = config.options.project.configPath();
    let env = require(configPath)(config.options.environment); //TODO: there must be a simpler way
    let socketServerPort = env.emberPresent.socketServerPort || DEFAULT_SOCKET_SERVER_PORT;

    let app = config.app;
    let http = require('http').Server(app);
    let io = require('socket.io')(http);

    http.listen(socketServerPort, function() {
      console.log('socket server listening on *:' + socketServerPort);
    });

    io.on('connection', function(socket) {
      console.log('GJ: SOCKET CONNECT', socket.id);

      socket.on('disconnect', function() {
        console.log('GJ: SOCKET DISCONNECT', socket.id);
      });

      //TODO: lock down to presenter role
      socket.on('goToSlide', function(data) {
        currentSlide = data.slide;
        io.emit('goToSlide', data);
      });

      socket.on('setInitialSlideState', function() {
        if (currentSlide) {
          socket.emit('goToSlide', { slide: currentSlide });
        }
      });
    });
  }
};
