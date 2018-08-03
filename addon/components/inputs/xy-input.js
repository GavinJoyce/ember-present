import Component from '@ember/component';
import { throttle } from '@ember/runloop';
import layout from '../../templates/components/inputs/xy-input';
import { computed } from '@ember/object';
import DomMixin from 'ember-lifeline/mixins/dom';

const SCROLL_PADDING = 50;

export default Component.extend(DomMixin, {
  layout,
  throttleMs: 25,

  $pointer: computed(function() {
    return this.element.querySelector('.pointer');
  }),
  $xLine: computed(function() {
    return this.element.querySelector('.xLine');
  }),
  $yLine: computed(function() {
    return this.element.querySelector('.yLine');
  }),

  didInsertElement() {
    this._super(...arguments);

    this._hideIosAddressBar();
    this.addEventListener(window.document.body, 'touchmove', this._preventScroll, { passive: false });

    let width = document.body.offsetWidth;
    let height = document.body.offsetHeight;

    let $pointer = this.get('$pointer');
    $pointer.style.left = `${width/2}px`;
    $pointer.style.top = `${height/2}px`;
    this.get('$xLine').style.left = `${width/2}px`;
    this.get('$yLine').style.top = `${height/2}px`;
  },

  touchStart(e) {
    throttle(this, this._throttleMove, e, this.get('throttleMs'));
  },

  touchMove(e) {
    throttle(this, this._throttleMove, e, this.get('throttleMs'));
  },

  _throttleMove(e) {
    if(e.touches.length === 1) {
      this._hideIosAddressBar();

      let touch = event.touches[0];
      let width = document.body.offsetWidth;
      let height = document.body.offsetHeight;

      let pageX = this._getXorYAdjustedForPadding(touch.pageX, width);
      let pageY = this._getXorYAdjustedForPadding(touch.pageY, height);

      let $pointer = this.get('$pointer');
      let $xLine = this.get('$xLine');
      let $yLine = this.get('$yLine');

      $pointer.style.left = `${pageX}px`;
      $xLine.style.left = `${pageX}px`;
      $pointer.style.top = `${pageY}px`;
      $yLine.style.top = `${pageY}px`;

      let onChange = this.get('onChange');
      if (onChange) {
        this.get('onChange')({
          xPercent: this._getPercentage(pageX, width),
          yPercent: this._getPercentage(pageY, height),
        });
      }
    }
  },

  _getXorYAdjustedForPadding(pageXorY, widthOrHeight) {
    if (pageXorY < SCROLL_PADDING) {
      return SCROLL_PADDING;
    } else if(pageXorY > widthOrHeight - SCROLL_PADDING) {
      return widthOrHeight - SCROLL_PADDING;
    } else {
      return pageXorY;
    }
  },

  _getPercentage(pageXorY, widthOrHeight) {
    let percentage = ((pageXorY - SCROLL_PADDING) / (widthOrHeight - (SCROLL_PADDING*2))) * 100;
    return Math.round(percentage * 100) / 100
  },

  _preventScroll(e) {
    e.preventDefault();
  },

  _hideIosAddressBar() {
    window.scrollTo(0, 1);
  }
});
