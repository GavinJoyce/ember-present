import Slide from './x-slide';
import layout from '../templates/components/x-video-slide';

export default Slide.extend({
  layout,
  tagName: 'video',
  attributeBindings: ['preload', 'autoplay'],

  preload: true,
  autoplay: true
});
