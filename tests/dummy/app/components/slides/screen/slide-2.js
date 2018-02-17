import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
  realtime: inject(),

  redCount: 0,
  greenCount: 0,
  blueCount: 0,

  async didInsertElement() {
    this._super(...arguments);

    let realtime = this.get('realtime');
    realtime.on('users.metadata.favouriteColour.summary', this.favouriteColourSummary, this);
    let data = await realtime.emitWithResponse('getMetadataSummary', 'favouriteColour');
    this.favouriteColourSummary(data);
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
