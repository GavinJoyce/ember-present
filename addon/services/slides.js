import { getOwner } from '@ember/application';
import Service, { inject } from '@ember/service';
import { computed, set } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import Evented from '@ember/object/evented';
import { A } from '@ember/array';

export default Service.extend(Evented, {
  realtime: inject(),
  fastboot: inject(),
  config: inject(),
  configuration: readOnly('config.emberPresent'),

  currentIndex: 0,
  role: undefined,
  roleIdentifier: undefined,

  init() {
    this._super(...arguments);

    if (!this.get('fastboot.isFastBoot')) {
      let realtime = this.get('realtime');
      realtime.on('goToSlide', (data) => {
        this.goToSlide(data.slide);
      }, this);

      realtime.emit('setInitialSlideState');
    }
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

  setupRole(roleIdentifier) { //TODO: test and refactor
    let role = this.get(`configuration.roles.${roleIdentifier}`);
    this.set('role', role);
    this.set('roleIdentifier', roleIdentifier);

    let owner = getOwner(this);
    let config = owner.factoryFor('slides:main').class;

    let slides = A();

    if (config) {
      config.slides.forEach((slide) => {
        let componentPath = `slides/${roleIdentifier}/${slide.name}`;

        if (!this._componentExists(componentPath)) {
          let rolesConfig = slide.roles || {};
          let customRoleConfig = rolesConfig[roleIdentifier];

          if (customRoleConfig) {
            componentPath = customRoleConfig.componentPath; //TODO: check if exists
          } else {
            componentPath = 'slides/blank-slide';
          }
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
      this.get('realtime').emit('goToSlide', { slide: this.get('currentName') });
    }
  },

  next() {
    if (!this.get('isLastSlide')) {
      this.incrementProperty('currentIndex');
      this.trigger('next');
      this.trigger('change');

      this.get('realtime').emit('goToSlide', { slide: this.get('currentName') });
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
