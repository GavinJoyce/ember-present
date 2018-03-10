import Component from '@ember/component';
import layout from '../../templates/components/backgrounds/video-background';

export default Component.extend({
  layout,

  didRender() {
    this._super(...arguments);

    let $video = this.$('video');
    if($video) {
      let video = $video[0];
      video.load();
      video.play();
    }
  }
});
