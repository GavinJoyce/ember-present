import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
  realtime: inject(),
  connectedUsers: inject(),

  redCount: 0,
  greenCount: 0,
  blueCount: 0,

  didInsertElement() {
    this._super(...arguments);

    let realtime = this.get('realtime');
    realtime.on('users.metadata.favouriteColour.summary', this.favouriteColourSummary, this);
  },

  willDestroyElement() {
    this._super(...arguments);

    let realtime = this.get('realtime');
    realtime.off('users.metadata.favouriteColour.summary', this.favouriteColourSummary);
  },

  favouriteColourSummary(data) {
    this.setProperties({
      redCount: data.red || 0,
      greenCount: data.green || 0,
      blueCount: data.blue || 0
    });
  },
});
