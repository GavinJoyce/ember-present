'use strict';

const SocketServer = require('./socket-server');

const CONFIG_DEFAULTS = {
  socketServerPort: 5200,
};

module.exports = {
  name: 'ember-present',

  options: {

  },

  SocketServer,

  included(app) {
    this._super(...arguments);

    app.import('vendor/ember-present.css');
  },

  serverMiddleware: function(config) {
    let configPath = config.options.project.configPath();
    let env = require(configPath)(config.options.environment); //TODO: there must be a simpler way
    let emberPresentConfiguration = Object.assign(
      {},
      CONFIG_DEFAULTS,
      (env.emberPresent || {})
    );

    let socketServer = new SocketServer(config.app, emberPresentConfiguration);
    socketServer.start();
  }
};
