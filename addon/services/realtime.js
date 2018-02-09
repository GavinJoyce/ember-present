import Service, { inject } from '@ember/service';
import { Promise } from 'rsvp';

export default Service.extend({
  socketIo: inject('socket-io'),
  fastboot: inject(),
  config: inject(),

  init() {
    this._super(...arguments);

    if (this.get('fastboot.isFastBoot')) {
      throw `You can't use the ember-present realtime service in fastboot.`;
    }

    let socketServerUrl = this.get('config.emberPresent.socketServerUrl');
    let socket = this.get('socketIo').socketFor(socketServerUrl);
    this.set('socket', socket);
  },

  on() {
    this.get('socket').on(...arguments);
  },

  off() {
    this.get('socket').off(...arguments);
  },

  emit() {
    this.get('socket').emit(...arguments);
  },

  emitWithResponse() {
    return new Promise((resolve) => {
      this.get('socket').emit(...arguments, resolve);
    });
  }
});
