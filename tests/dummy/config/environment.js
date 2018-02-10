'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'dummy',
    environment,
    rootURL: '/',
    locationType: 'auto',
    'ember-websockets': {
      socketIO: true
    },
    emberPresent: {
      socketServerUrl: 'http://localhost:5200',
      socketServerPort: 5200,
      roles: {
        presenter: {
          password: 'presenterpassword',
          route: 'auth.presenter'
        },
        notes: {
          password: 'notespassword',
          route: 'auth.notes'
        },
        screen: {
          password: 'screenpassword',
          route: 'auth.screen'
        },
        audience: {
          route: 'auth.audience'
        }
      }
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },
    fastboot: {
      hostWhitelist: [/^localhost:\d+$/]
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    ENV.locationType = 'hash';
    ENV.baseUrl = '/ember-present/';
    // here you can enable a production-specific feature
  }

  return ENV;
};
