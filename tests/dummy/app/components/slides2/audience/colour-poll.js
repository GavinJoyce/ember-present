import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
  realtime: inject(),
  session2: inject(),

  actions: {
    chooseColour(favouriteColour) {
      this.get('realtime').emit('updateUserMetaData', { favouriteColour });
    }
  }
});
