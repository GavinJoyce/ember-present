import Service, { inject } from '@ember/service';
import { Promise } from 'rsvp';

export default Service.extend({
  socketIo: inject('socket-io'),
  config: inject(),

  init() {
    this._super(...arguments);

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

  broadcast(name, data) {
    this.emit('broadcast', { name, data });
  },

  broadcastToRole(role, name, data) {
    this.emit('broadcastToRole', { role, name, data });
  },

  emitWithResponse() {
    return new Promise((resolve) => {
      this.get('socket').emit(...arguments, resolve);
    });
  }
});
