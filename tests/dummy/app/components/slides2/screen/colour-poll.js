import Component from '@ember/component';
import Object from '@ember/object';
import { inject } from '@ember/service';

export default Component.extend({
  realtime: inject(),
  counts: undefined,

  init() {
    this._super(...arguments);

    this.set('counts', new Object({
      red: 0,
      green: 0,
      blue: 0,
    }));
  },

  async didInsertElement() {
    this._super(...arguments);

    let realtime = this.get('realtime');
    realtime.on('users.metadata.favouriteColour.counts', this.favouriteColourCounts, this);
    let data = await realtime.emitWithResponse('getMetadataCounts', 'favouriteColour');
    this.favouriteColourCounts(data);
  },

  willDestroyElement() {
    this._super(...arguments);

    let realtime = this.get('realtime');
    realtime.off('users.metadata.favouriteColour.counts', this.favouriteColourCounts);
  },

  favouriteColourCounts(data) {
    this.get('counts').setProperties({
      red: data.counts.red || 0,
      green: data.counts.green || 0,
      blue: data.counts.blue || 0
    });
  },
});
