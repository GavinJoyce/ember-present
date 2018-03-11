import Session from 'ember-present/services/session';

export default {
  name: 'ember-present',

  initialize(applicationInstance) {
    applicationInstance.register('service:session', Session);
  }
};
