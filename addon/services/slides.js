import Service, { inject } from '@ember/service';
import Controller from '@ember/controller';
import { mapBy, readOnly, reads } from '@ember/object/computed';
import { schedule } from '@ember/runloop';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { on } from '@ember/object/evented';
import { getOwner } from '@ember/application';
import { EKMixin as EmberKeyboard, keyUp } from 'ember-keyboard';
import Slide from 'ember-present/models/slide';
import SlideTransition from 'ember-present/models/slide-transition';
import slideControllerTemplate from 'ember-present/templates/internal/slide-controller';

export default Service.extend(EmberKeyboard, {
  realtime: inject(),
  router: inject(),
  session: inject(),
  config: inject(),

  slideRoutes: undefined,

  roles: computed('config.emberPresent.roles', function() {
    return Object.values(this.get('config.emberPresent.roles'));
  }),

  currentRouteName: reads('router.currentRouteName'),

  init() {
    this._super(...arguments);

    this.set('keyboardActivated', true);
    this.set('slideRoutes', A());

    let realtime = this.get('realtime');
    realtime.on('goToSlide', (data) => {
      this.goToSlide(data.slide);
    }, this);
  },

  registerSlide(path, parent, config = {}) {
    let slide = Slide.create({ path, parent, config });
    this.get('slideRoutes').pushObject(slide);

    let SlideController = Controller.extend({
      session: inject(),
      slides: inject(),
      slide,
    });

    let owner = getOwner(this);
    let containerPath = slide.get('containerPath');
    owner.register(`controller:${containerPath}`, SlideController);
    owner.register(`template:${containerPath}`, slideControllerTemplate);

    this.get('roles').forEach(role => {
      let componentPath = this._getComponentPath(slide, role);

      if (componentPath) {
        slide.set(`${role.name}ComponentPath`, componentPath);
      } else {
        slide.set(`${role.name}SlideIsMissing`, true);
      }
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

  firstSlide: readOnly('slideRoutes.firstObject'),

  currentSlideIndex: computed('slidePaths.[]', 'currentRouteName', function() {
    let currentRouteName = this.get('currentRouteName');
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
      this.get('realtime').emit('goToSlide', { slide: slide.path });
    }
  },

  next() {
    if (this.get('hasNextSlide')) {
      let slide = this.get('nextSlide');
      this.get('router').transitionTo(slide.path);
      this.get('realtime').emit('goToSlide', { slide: slide.path });
    }
  },

  first() {
    let slidePath = this.get('slidePaths.firstObject');
    this.get('router').transitionTo(slidePath);
  },

  goToSlide(slide) {
    if (this.get('session.isAuthenticated')) {
      this.get('router').transitionTo(slide);

      schedule('afterRender', this, () => {
        window.scrollTo(0, 0);
      });
    }
  },

  actions: {
    previous() {
      this.previous();
    },
    next() {
      this.next();
    },
  },

  _getComponentPath(slide, role) {
    let componentPaths = slide.getRoleComponentPaths(role);
    let owner = getOwner(this);

    for (let componentPath of componentPaths) {
      let template = owner.lookup(`template:components/${componentPath}`);

      if (template) {
        return componentPath;
      }
    }
  },
});
