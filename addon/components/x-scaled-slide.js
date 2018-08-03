import Component from '@ember/component';
import { inject } from '@ember/service';
import layout from '../templates/components/x-scaled-slide';
import DomMixin from 'ember-lifeline/mixins/dom';
import Realtime from 'ember-present/mixins/realtime';

export default Component.extend(DomMixin, Realtime, {
  layout,
  classNames: ['slide', 'scaled-slide'],
  pointerData: undefined,

  slides: inject(),

  didInsertElement() {
    this._super(...arguments);

    this.addEventListener(window, 'resize', this._onResize);
    this._onResize();

    this.addRealtimeListener('pointerData', (pointerData) => {
      this.set('pointerData', pointerData);
    });
  },

  _onResize() {
    let container = document.querySelectorAll('.slides')[0];
    let slide = document.querySelectorAll('.slide')[0];

    let scale = Math.min(
      container.offsetWidth / slide.offsetWidth,
      container.offsetHeight / slide.offsetHeight
    );

    slide.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }
});
