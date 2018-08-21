import Component from '@ember/component';
import move from 'ember-animated/motions/move';
import scale from 'ember-animated/motions/scale';

import model from '../../../models/data';

export default Component.extend({

  init() {
    this._super(...arguments);
    this.set('model', model);
  },

  transition: function * ({ sentSprites, receivedSprites }) {
    yield sentSprites.forEach(sprite => {
      scale(sprite);
      move(sprite);
    });

    yield receivedSprites.forEach(sprite => {
      scale(sprite);
      move(sprite);
    });
  },
});

