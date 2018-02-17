import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import Realtime from 'ember-present/mixins/realtime';

export default Component.extend(Realtime, {
  playingSound: undefined,

  didInsertElement() {
    this._super(...arguments);

    this.addRealtimeListener('playSound', ({ sound }) => {
      this.get('displaySound').perform(sound);
    });
  },

  displaySound: task(function * (sound) {
    this.set('playingSound', sound);
    yield timeout(300);
    this.set('playingSound', null);
  })
});
