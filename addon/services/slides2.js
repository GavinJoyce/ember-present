import Service, { inject as service } from '@ember/service';
import Object from '@ember/object';
import { mapBy, readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { on } from '@ember/object/evented';
import { EKMixin as EmberKeyboard, keyUp } from 'ember-keyboard';
const { HTMLBars } = Ember;

const Slide = Object.extend({
  path: undefined,
  config: undefined
});

const SlideTransition = Object.extend({
  sourceSlide: undefined,
  targetSlide: undefined,
  isForwards: undefined,
});

const SlideController = Ember.Controller.extend({
  init() {
    this._super(...arguments);

    console.log('SLIDE CONTROLLER');
  },
});

export default Service.extend(EmberKeyboard, {
  router: service(),

  slideRoutes: undefined,
  roles: undefined,

  init() {
    this._super(...arguments);

    this.set('keyboardActivated', true);
    this.set('slideRoutes', A());
    this.set('roles', A());
  },

  registerSlide(path, config = {}) {
    this.get('slideRoutes').pushObject(
      Slide.create({ path, config })
    );

    //temp: gj: can we generate a template?
    

    let owner = Ember.getOwner(this);
    let containerPath = path.replace('.', '/');
    console.log(path, containerPath);
    owner.register(`controller:${containerPath}`, SlideController);


    owner.register(`template:${containerPath}`, HTMLBars.compile("<h1>Slide (compiled)" + containerPath + "</h1>"));

    // let template = HTMLBars.compile("hello slide 5");
    // console.log('TEMPLATE', template);


  },

  registerRole(name, config) {
    this.get('roles').pushObject({
      name,
      config,
    });
  },

  slidePaths: mapBy('slideRoutes', 'path'),
  slideCount: readOnly('slidePaths.length'),

  getSlideTransition(sourceRouteName, targetRouteName) {
    let sourceSlide = this.get('slideRoutes').findBy('path', sourceRouteName);
    let targetSlide = this.get('slideRoutes').findBy('path', targetRouteName);

    let sourceSlideIndex = this.get('slidePaths').indexOf(sourceRouteName);
    let targetSlideIndex = this.get('slidePaths').indexOf(targetRouteName);

    return SlideTransition.create({
      sourceSlide,
      targetSlide,
      isForwards: targetSlideIndex > sourceSlideIndex
    });
  },

  currentSlideIndex: computed('slidePaths.[]', 'router.currentRouteName', function() {
    let currentRouteName = this.get('router.currentRouteName');
    let index = this.get('slidePaths').indexOf(currentRouteName);

    if (index === -1) {
      return undefined;
    } else {
      return index;
    }
  }),

  currentSlideNumber: computed('currentSlideIndex', function() {
    let currentSlideIndex = this.get('currentSlideIndex');

    if (currentSlideIndex === undefined) {
      return undefined;
    } else {
      return currentSlideIndex + 1;
    }
  }),

  currentSlidePath: computed('slidePaths.[]', 'currentSlideIndex', function() {
    let slidePaths = this.get('slidePaths');
    let currentSlideIndex = this.get('currentSlideIndex');
    return slidePaths[currentSlideIndex];
  }),

  currentSlide: computed('slideRoutes.[]', 'currentSlideIndex', function() {
    let slideRoutes = this.get('slideRoutes');
    let currentSlideIndex = this.get('currentSlideIndex');
    return slideRoutes[currentSlideIndex];
  }),

  previousSlideIndex: computed('currentSlideIndex', function() {
    let currentSlideIndex = this.get('currentSlideIndex');

    if (currentSlideIndex > 0) {
      return currentSlideIndex - 1;
    } else {
      return 0;
    }
  }),

  previousSlide: computed('previousSlideIndex', 'slideRouteNames.[]', function() {
    let slideRoutes = this.get('slideRoutes');
    let previousSlideIndex = this.get('previousSlideIndex');
    return slideRoutes[previousSlideIndex];
  }),

  hasPreviousSlide: computed('currentSlideIndex', function() {
    let currentSlideIndex = this.get('currentSlideIndex');
    return currentSlideIndex > 0;
  }),

  hasNextSlide: computed('currentSlideIndex', 'slideCount', function() {
    let currentSlideIndex = this.get('currentSlideIndex');
    let slideCount = this.get('slideCount');

    return currentSlideIndex < slideCount - 1;
  }),

  nextSlideIndex: computed('currentSlideIndex', 'slideCount', function() {
    let slideCount = this.get('slideCount');
    let currentSlideIndex = this.get('currentSlideIndex');

    if (currentSlideIndex < slideCount - 1) {
      return currentSlideIndex + 1;
    } else {
      return currentSlideIndex;
    }
  }),

  nextSlide: computed('slideRoutes.[]', 'nextSlideIndex', function() {
    let slideRoutes = this.get('slideRoutes');
    let nextSlideIndex = this.get('nextSlideIndex');
    return slideRoutes[nextSlideIndex];
  }),

  onLeft: on(keyUp('ArrowLeft'), function() {
    this.previous();
  }),

  onRight: on(keyUp('ArrowRight'), keyUp('Space'), keyUp('Enter'), function() {
    this.next();
  }),

  previous() {
    if (this.get('hasPreviousSlide')) {
      let slide = this.get('previousSlide');
      this.get('router').transitionTo(slide.path);
    }
  },

  next() {
    if (this.get('hasNextSlide')) {
      let slide = this.get('nextSlide');
      this.get('router').transitionTo(slide.path);
    }
  },

  first() {
    let slidePath = this.get('slidePaths.firstObject');
    this.get('router').transitionTo(slidePath);
  },
});
