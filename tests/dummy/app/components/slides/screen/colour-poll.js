import Component from '@ember/component';
import Object from '@ember/object';
import { inject } from '@ember/service';

export default Component.extend({
  realtime: inject(),
  counts: undefined,

  init() {
    this._super(...arguments);

    this.set('colourCounts', new Object({
      red: 0,
      green: 0,
      blue: 0,
    }));

    this.set('animalCounts', new Object({
      cat: 0,
      dog: 0,
      cow: 0,
    }));
  },

  async didInsertElement() {
    this._super(...arguments);

    let realtime = this.get('realtime');
    realtime.on('users.metadata.favouriteColour.counts', this.favouriteColourCounts, this);
    realtime.on('users.metadata.favouriteAnimal.counts', this.favouriteAnimalCounts, this);
    let data = await realtime.emitWithResponse('getMetadataCounts', 'favouriteColour');
    this.favouriteColourCounts(data);

    let animalData = await realtime.emitWithResponse('getMetadataCounts', 'favouriteAnimal');
    this.favouriteAnimalCounts(animalData);
  },

  willDestroyElement() {
    this._super(...arguments);

    let realtime = this.get('realtime');
    realtime.off('users.metadata.favouriteColour.counts', this.favouriteColourCounts);
  },

  favouriteColourCounts(data) {
    this.get('colourCounts').setProperties({
      red: data.counts.red || 0,
      green: data.counts.green || 0,
      blue: data.counts.blue || 0
    });
  },
  favouriteAnimalCounts(data) {
    this.get('animalCounts').setProperties({
      cat: data.counts.cat || 0,
      dog: data.counts.dog || 0,
      cow: data.counts.cow || 0
    });
  },
});
