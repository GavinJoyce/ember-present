import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
  slidesService: inject(),

  count: 0,

  didInsertElement() {
    this._super(...arguments);

    this.get('slidesService').handleNavigation(this);
  },

  next() {
    let count = this.get('count');

    if (count < 3) {
      this.incrementProperty('count');
    } else {
      return true;
    }
  },

  previous() {
    let count = this.get('count');

    if (count > 0) {
      this.decrementProperty('count');
    } else {
      return true;
    }
  }
});
