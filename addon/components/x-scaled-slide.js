import Component from '@ember/component';
// import { computed, get } from '@ember/object';
// import { readOnly, notEmpty } from '@ember/object/computed';
import { inject } from '@ember/service';
import layout from '../templates/components/x-scaled-slide';
import DomMixin from 'ember-lifeline/mixins/dom';

export default Component.extend(DomMixin, {
  layout,
  classNames: ['slide', 'scaled-slide'],

  slides: inject(),

  // roleData: computed('slides.roleIdentifier', 'slide', function() {
  //   let slide = this.get('slide');
  //   let roleIdentifier = this.get('slides.roleIdentifier');
  //
  //   return get(slide, `roles.${roleIdentifier}`);
  // }),
  //
  // backgroundData: readOnly('roleData.background'),
  // hasBackgroundData: notEmpty('backgroundData'),

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
