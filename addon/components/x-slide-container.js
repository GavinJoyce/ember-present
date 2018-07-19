import Component from '@ember/component';
import layout from '../templates/components/x-slide-container';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  layout,
  tagName: '',
  session: service(),

  slideContainerComponent: computed('session.role', function() {
    let role = this.get('session.role');

    if (role === 'screen') {
      return 'x-scaled-slide';
    } else {
      return 'x-responsive-slide';
    }
  }),
});
