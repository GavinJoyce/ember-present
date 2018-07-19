import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from '../../templates/components/backgrounds/video-background2';

export default Component.extend({
  layout,

  didInsertElement() {
    this._super(...arguments);

    let video = this.$('video')[0];
    video.load();
    video.play();
  },

  type: computed('src', function() {
    let src = this.get('src');

    if (src.endsWith('.webm')) {
      return 'video/webm';
    } else {
      return 'video/mp4';
    }
  }),
});
