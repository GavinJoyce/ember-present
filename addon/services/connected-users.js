import Service, { inject } from '@ember/service';
import { computed } from '@ember/object';
import { task, timeout } from 'ember-concurrency';

export default Service.extend({
  realtime: inject(),

  users: undefined,
  audience: computed('users.[]', function() {
    let users = this.get('users');
    if (users) {
      return users.filter(u => u.role === 'audience');
    }
  }),

  init() {
    this._super(...arguments);

    let realtime = this.get('realtime');

    realtime.on('userModified', () => {
      this.get('fetchUsers').perform();
    });
  },

  fetchUsers: task(function * () {
    yield timeout(500);

    let realtime = this.get('realtime');

    //TODO: GJ: perhaps replace with a get request?
    let response = yield realtime.emitWithResponse('getUsers');
    this.set('users', Object.values(response.connectedUsers));
  }).keepLatest(),
});
