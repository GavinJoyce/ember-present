import Component from '@ember/component';
import { inject as service } from '@ember/service';
import layout from '../templates/components/x-responsive-slide';

export default Component.extend({
  layout,
  classNames: ['slide', 'responsive-slide'],

  slides: service(),
  session: service(),
});
