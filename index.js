'use strict';

const SocketServer = require('./socket-server');

module.exports = {
  name: 'ember-present',

  options: {
    'ember-cli-tailwind': {
      buildTarget: 'addon'
    }
  },

  SocketServer,

  included(app) {
    this._super(...arguments);

    app.import('vendor/ember-present.css');
  },

  serverMiddleware: function(config) {
    let configPath = config.options.project.configPath();
    let env = require(configPath)(config.options.environment); //TODO: there must be a simpler way
    let emberPresentConfiguration = env.emberPresent;

    let socketServer = new SocketServer(config.app, emberPresentConfiguration);
    socketServer.start();
  }
};
