import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { inject } from '@ember/service';

export default Component.extend({
  realtime: inject(),
  connectedUsers: inject(),

  audience: readOnly('connectedUsers.audience'),

  redUsers: computed('audience.[]', function() { //TODO: GJ: extract to CP macro
    let audience = this.get('audience');

    if (audience) {
      return audience.filter(a => get(a, 'metadata.favouriteColour') === 'red');
    }
  }),

  greenUsers: computed('audience.[]', function() {
    let audience = this.get('audience');

    if (audience) {
      return audience.filter(a => get(a, 'metadata.favouriteColour') === 'green');
    }
  }),

  blueUsers: computed('audience.[]', function() {
    let audience = this.get('audience');

    if (audience) {
      return audience.filter(a => get(a, 'metadata.favouriteColour') === 'blue');
    }
  }),


});
