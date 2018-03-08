import Component from '@ember/component';
import layout from '../../templates/components/backgrounds/video-background';

export default Component.extend({
  layout,

  didReceiveAttrs() { //TODO: GJ: only if the src changes
    let $video = this.$('video');
    if($video) {
      let video = $video[0];
      video.load();
      video.play();
    }
  }
});
