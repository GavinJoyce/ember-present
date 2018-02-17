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

  broadcast(name, data) {
    this.get('realtime').broadcast(name, data);
  }
});
