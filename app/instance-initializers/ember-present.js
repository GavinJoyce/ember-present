import Session from 'ember-present/services/session';

export default {
  name: 'ember-present',

  initialize(applicationInstance) {
    if (typeof(FastBoot) === "undefined") {
      applicationInstance.register('service:session', Session);
    }
  }
};
