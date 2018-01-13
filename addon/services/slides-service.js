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

  isFirstSlide: computed.equal('currentIndex', 0),
  isLastSlide: computed('currentIndex', 'slides.length', function() {
    return this.get('currentIndex') === (this.get('slides.length') - 1);
  }),

  previous() {
    let proceed = true;

    let navigationHandler = this.get('navigationHandler');
    if (navigationHandler && navigationHandler.previous) {
      proceed = navigationHandler.previous();
    }

    if (proceed && !this.get('isFirstSlide')) {
      this.set('navigationHandler', undefined);
      this.decrementProperty('currentIndex');
    }
  },

  next() {
    let proceed = true;

    let navigationHandler = this.get('navigationHandler');
    if (navigationHandler && navigationHandler.next) {
      proceed = navigationHandler.next();
    }

    if (proceed && !this.get('isLastSlide')) {
      this.set('navigationHandler', undefined);
      this.incrementProperty('currentIndex');
    }
  },

  handleNavigation(component) {
    this.set('navigationHandler', component);
  },

  actions: {
    previous() {
      this.previous();
    },
    next() {
      this.next();
    }
  }
});
