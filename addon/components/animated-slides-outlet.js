import Component from '@ember/component';
import layout from '../templates/components/animated-slides-outlet';
import { inject as service } from '@ember/service';
import fade from 'ember-animated/transitions/fade';
import { toLeft, toRight } from 'ember-animated/transitions/move-over';
import { computed } from '@ember/object';

const TRANSITIONS_MAP = {
  slide: toLeft,
  fade
};

const REVERSE_TRANSITIONS_MAP = {
  slide: toRight
};

export default Component.extend({
  layout,

  slides2: service(),

  duration: 300,

  rules: computed('rules', function() {
    return this._rules.bind(this);
  }),

  _rules: function({ newItems, oldItems }) {
    let sourceRoute = oldItems[oldItems.length - 1];
    let targetRoute = newItems[newItems.length - 1];
    let sourceRouteName, targetRouteName;

    if (sourceRoute) {
      sourceRouteName = sourceRoute.outlets.main.render.name;
    }
    if (targetRoute) {
      targetRouteName = targetRoute.outlets.main.render.name;
    }

    let slides2 = this.get('slides2');
    let slideTransition = slides2.getSlideTransition(sourceRouteName, targetRouteName);
    let targetTransition = slideTransition.get('targetSlide.config.transition');
    let sourceTransition = slideTransition.get('sourceSlide.config.transition');

    if (slideTransition.get('isForwards') && targetTransition) {
      return TRANSITIONS_MAP[targetTransition];
    }

    if (sourceTransition) {
      return REVERSE_TRANSITIONS_MAP[sourceTransition] || TRANSITIONS_MAP[sourceTransition];
    }
  },
});
