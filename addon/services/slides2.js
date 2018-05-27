import Service, { inject as service } from '@ember/service';
import { mapBy, readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Service.extend({
  router: service(),

  init() {
    this._super(...arguments);

    this.set('slideRoutes', A());
  },

  registerSlide(path, config = {}) {
    this.get('slideRoutes').pushObject({ path, config });
  },

  slidePaths: mapBy('slideRoutes', 'path'),
  slideCount: readOnly('slidePaths.length'),

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
});
