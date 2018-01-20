import Service, { inject } from '@ember/service';

//TODO: config
const SOCKET_SERVER = 'http://localhost:5200';

export default Service.extend({
  socketIo: inject('socket-io'),

  init() {
    this._super(...arguments);

    let socket = this.get('socketIo').socketFor(SOCKET_SERVER);
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
