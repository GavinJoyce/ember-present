/* eslint ember/no-on-calls-in-components: 0 */

import { inject } from '@ember/service';
import { on } from '@ember/object/evented';
import Component from '@ember/component';
import { EKMixin as EmberKeyboard, keyUp } from 'ember-keyboard';
import layout from '../templates/components/x-slides';

export default Component.extend(EmberKeyboard, {
  layout,

  slidesService: inject(),
  realtimeService: inject(),

  role: 'screen',

  init() {
    this._super(...arguments);
    this.set('keyboardActivated', true);

    let slidesService = this.get('slidesService');
    slidesService.setupRole(this.get('role'));
  },

  onLeft: on(keyUp('ArrowLeft'), function() {
    this.get('slidesService').previous();
  }),

  onRight: on(keyUp('ArrowRight'), keyUp('Space'), keyUp('Enter'), function() {
    this.get('slidesService').next();
  })
});
