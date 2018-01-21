'use strict';

const SOCKET_SERVER_PORT = 5200;

let currentSlide;

module.exports = {
  name: 'ember-present',

  included(app) {
    app.import('vendor/ember-present.css');
  },

  serverMiddleware: function(config) {
    //TODO: GJ: extract to https://github.com/gavinjoyce/ember-present-server

    let app = config.app;
    let http = require('http').Server(app);
    let io = require('socket.io')(http);

    http.listen(SOCKET_SERVER_PORT, function() {
      console.log('listening on *:' + SOCKET_SERVER_PORT);
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
