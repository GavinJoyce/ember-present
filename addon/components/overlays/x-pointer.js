import Component from '@ember/component';
import { schedule } from '@ember/runloop';
import layout from '../../templates/components/overlays/x-pointer';

const SLIDE_WIDTH = 1920;
const SLIDE_HEIGHT = 1080;

export default Component.extend({
  layout,

  didReceiveAttrs() {
    this._super(...arguments);

    schedule('afterRender', this, this._movePointer);
  },

  didUpdateAttrs() {
    this._super(...arguments);

    this._movePointer();
  },

  _movePointer() {
    let left = (SLIDE_WIDTH * (this.get('pointerData.xPercent') / 100));
    let top = (SLIDE_HEIGHT * (this.get('pointerData.yPercent') / 100));

    let $pointer = this.element.querySelector('.pointer');
    $pointer.style.left = `${left}px`;
    $pointer.style.top = `${top}px`;
  },
});
