import DisposableMixin from 'ember-lifeline/mixins/disposable';
import Mixin from '@ember/object/mixin';
import { inject } from '@ember/service';
import { task } from 'ember-concurrency';

export default Mixin.create(DisposableMixin, {
  realtime: inject(),

  addRealtimeListener(name, callback) {
    let realtime = this.get('realtime');
    realtime.on(name, callback, this);
    this.registerDisposable(() => realtime.off(name, callback));
  },

  async addMetadataSummaryRealtimeListener(key, callback) { //TODO: task?
    this.addRealtimeListener(`users.metadata.${key}.summary`, callback);

    let realtime = this.get('realtime');
    let data = await realtime.emitWithResponse('getMetadataSummary', key);

    if (this.isDestroyed) { return; }
    callback(data);
  },

  getRandomUserWithMetadata: task(function * (key, value) {
    return yield this.get('realtime').emitWithResponse('getRandomUserWithMetadata', key, value);
  }),

  broadcast(name, data) {
    this.get('realtime').broadcast(name, data);
  },

  broadcastToRoles(roles, name, data) {
    roles.forEach((role) => {
      this.get('realtime').broadcastToRole(role, name, data);
    });
  },

  broadcastToRole(role, name, data) {
    this.get('realtime').broadcastToRole(role, name, data);
  }
});
