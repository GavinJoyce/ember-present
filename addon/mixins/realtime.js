import DisposableMixin from 'ember-lifeline/mixins/disposable';
import Mixin from '@ember/object/mixin';
import { inject } from '@ember/service';

export default Mixin.create(DisposableMixin, {
  realtime: inject(),

  addRealtimeListener(name, callback) {
    let realtime = this.get('realtime');
    realtime.on(name, callback, this);
    this.registerDisposable(() => realtime.off(name, callback));
  },

  async addMetadataSummaryRealtimeListener(key, callback) {
    this.addRealtimeListener(`users.metadata.${key}.summary`, callback);

    let realtime = this.get('realtime');
    let data = await realtime.emitWithResponse('getMetadataSummary', key);
    callback(data);
  },

  broadcast(name, data) {
    this.get('realtime').broadcast(name, data);
  }
});
