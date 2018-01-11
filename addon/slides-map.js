import { getOwner } from '@ember/application';
import Service from '@ember/service';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Service.extend({
  currentIndex: 0,

  init() {
    this._super(...arguments);

    let owner = getOwner(this);
    let config = owner.factoryFor('slides:main').class;

    let slides = A();

    if (config) {
      config.slides.forEach((slide) => {
        //TODO: GJ: check if components exist
        slide.componentPath = `slides/${slide.name}`;
        slides.pushObject(slide);
      });
    }

    this.set('slides', slides);
  },

  current: computed('slides.[]', 'currentIndex', function() {
    return this.get('slides').objectAt(this.get('currentIndex'));
  }),

  actions: {
    previous() {
      this.decrementProperty('currentIndex');
    },
    next() {
      this.incrementProperty('currentIndex');
    }
  }
});
