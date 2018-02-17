import Service from '@ember/service';
import { bind } from '@ember/runloop';

export default Service.extend({
  isSpriteLoaded: false,

  init() {
    window.Waud.init();
    window.Waud.enableTouchUnlock();

    let sprite = new window.WaudSound('/sounds/sprite.json', {
      onload: bind(this, this._onLoad)
    });

    this.set('sprite', sprite);
  },

  _onLoad() {
    this.set('isSpriteLoaded', true);
  },

  play(sound, volume=1) {
    if (this.get('isSpriteLoaded')) {
      let sprite = this.get('sprite');
      sprite.setVolume(volume);
      sprite.play(sound);
    }
  }
});
