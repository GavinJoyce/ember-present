import { inject } from '@ember/service';
import Component from '@ember/component';
import layout from '../templates/components/x-slides';

export default Component.extend({
  layout,

  slidesService: inject()  
});
