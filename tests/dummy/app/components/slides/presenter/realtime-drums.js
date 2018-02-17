import Component from '@ember/component';
import Realtime from 'ember-present/mixins/realtime';

export default Component.extend(Realtime, {
  actions: {
    playSound(sound) {
      this.broadcast('playSound', { sound });
    }
  }
});
