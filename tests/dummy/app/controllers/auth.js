import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
  queryParams: ['slide'],

  slides: inject(),
  realtime: inject(),

  init() {
    this._super(...arguments);

    let slides = this.get('slides');

    slides.on('change', () => {
      this.set('slide', slides.get('current.name'));
    });
  }
});
