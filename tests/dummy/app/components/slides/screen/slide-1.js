import Component from '@ember/component';
import { later } from '@ember/runloop';
import { inject } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  realtime: inject(),
  connectedUserCount: undefined,

  didInsertElement() {
    this.get('updateConnectedUsers').perform();
  },

  updateConnectedUsers: task(function * () {
    let realtime = this.get('realtime');
    let response = yield realtime.emitWithResponse('getUserStatistics');

    this.set('connectedUserCount', response.connectedUserCount);

    later(this, function() {
      this.get('updateConnectedUsers').perform();
    }, 2000);
  })
});
