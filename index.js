'use strict';

const SocketServer = require('./socket-server');
const path = require('path');

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
    app.import(this.templateCompilerPath());
  },

  serverMiddleware: function(config) {
    let configPath = config.options.project.configPath();
    let env = require(configPath)(config.options.environment); //TODO: there must be a simpler way
    let emberPresentConfiguration = env.emberPresent;

    let socketServer = new SocketServer(config.app, emberPresentConfiguration);
    socketServer.start();
  },


  // borrowed from ember-cli-htmlbars http://git.io/vJDrW
  projectConfig() {
    return this.project.config(process.env.EMBER_ENV);
  },

  // borrowed from ember-cli-htmlbars http://git.io/vJDrw
  templateCompilerPath() {
    let config = this.projectConfig();
    let templateCompilerPath = config['ember-cli-htmlbars'] && config['ember-cli-htmlbars'].templateCompilerPath;

    let ember = this.project.findAddonByName('ember-source');
    if (ember) {
      return ember.absolutePaths.templateCompiler;
    } else if (!templateCompilerPath) {
      templateCompilerPath = this.project.bowerDirectory + '/ember/ember-template-compiler.js'; // append .js so that app.import doesn't fail
    }

    return path.resolve(this.project.root, templateCompilerPath);
  }
};
