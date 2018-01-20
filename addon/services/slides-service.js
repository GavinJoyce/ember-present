import { getOwner } from '@ember/application';
import Service, { inject } from '@ember/service';
import { computed, set } from '@ember/object';
import Evented from '@ember/object/evented';
import { A } from '@ember/array';

export default Service.extend(Evented, {
  realtimeService: inject(),

  currentIndex: 0,
  role: undefined,

  init() {
    this._super(...arguments);

    let realtimeService = this.get('realtimeService');
    realtimeService.on('goToSlide', (data) => {
      this.goToSlide(data.slide);
    }, this);
  },

  current: computed('slides.[]', 'currentIndex', function() {
    return this.get('slides').objectAt(this.get('currentIndex'));
  }),

  currentName: computed('current', function() {
    return this.get('current.name');
  }),

  isFirstSlide: computed.equal('currentIndex', 0),
  isLastSlide: computed('currentIndex', 'slides.length', function() {
    return this.get('currentIndex') === (this.get('slides.length') - 1);
  }),

  setupRole(role) {
    this.set('role', role);
    let owner = getOwner(this);
    let config = owner.factoryFor('slides:main').class;

    let slides = A();

    if (config) {
      config.slides.forEach((slide) => {
        let componentPath = `slides/${role}/${slide.name}`;

        if (!this._componentExists(componentPath)) {
          componentPath = 'slides/blank-slide';
        }

        set(slide, 'componentPath', componentPath);
        slides.pushObject(slide);
      });
    }

    this.set('slides', slides);
  },

  previous() {
    if (!this.get('isFirstSlide')) {
      this.decrementProperty('currentIndex');
      this.trigger('previous');
      this.trigger('change');
      this.get('realtimeService').emit('goToSlide', { slide: this.get('currentName') });
    }
  },

  next() {
    if (!this.get('isLastSlide')) {
      this.incrementProperty('currentIndex');
      this.trigger('next');
      this.trigger('change');

      this.get('realtimeService').emit('goToSlide', { slide: this.get('currentName') });
    }
  },

  goToSlide(name) {
    let slides = this.get('slides');

    if (slides) {
      let slideIndex = slides.findIndex((slide) => slide.name === name);

      if (slideIndex >= 0) {
        this.set('currentIndex', slideIndex);
      }
    }
  },

  actions: {
    previous() {
      this.previous();
    },
    next() {
      this.next();
    }
  },

  _componentExists(componentName) {
    let template = getOwner(this).lookup(`template:components/${componentName}`);
    return !!template;
  },
});
