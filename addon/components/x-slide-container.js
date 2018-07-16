import Component from '@ember/component';
import layout from '../templates/components/x-slide-container';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  layout,
  tagName: '',
  session2: service(),

  slideContainerComponent: computed('session2.role', function() {
    let role = this.get('session2.role');

    if (role === 'screen') {
      return 'x-scaled-slide2';
    } else {
      return 'x-responsive-slide2';
    }
  }),
});
