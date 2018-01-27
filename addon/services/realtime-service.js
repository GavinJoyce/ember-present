import Service, { inject } from '@ember/service';

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
    let socket = this.get('socket');
    socket.on.apply(socket, arguments);
  },

  off() {
    let socket = this.get('socket');
    socket.off.apply(socket, arguments);
  },

  emit() {
    let socket = this.get('socket');
    socket.emit.apply(socket, arguments);
  },
});
