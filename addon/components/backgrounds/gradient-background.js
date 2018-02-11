import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from '../../templates/components/backgrounds/gradient-background';

export default Component.extend({
  layout,

  //TODO: GJ: improve the API to this
  linearGradient: computed('backgroundData.linearGradient', function() {
    let linearGradient = this.get('backgroundData.linearGradient');

    if (linearGradient) {
      return linearGradient;
    } else {
      return '-45deg, #EE7752, #E73C7E, #23A6D5, #23D5AB';
    }
  })
});
