import Component from '@ember/component';
import layout from '../templates/components/x-slide';
import DomMixin from 'ember-lifeline/mixins/dom';

export default Component.extend(DomMixin, {
  layout,
  classNames: ['slide'],

  didInsertElement() {
    this._super(...arguments);

    this.addEventListener(window, 'resize', this._onResize);
    this._onResize();
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
