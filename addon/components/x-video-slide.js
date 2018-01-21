import Component from '@ember/component';
import layout from '../templates/components/x-video-slide';

export default Component.extend({
  layout,
  tagName: 'video',
  attributeBindings: ['preload', 'autoplay'],

  preload: true,
  autoplay: true
});
