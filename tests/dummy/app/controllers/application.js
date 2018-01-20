import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
  queryParams: ['slide'],

  slidesService: inject(),
  realtimeService: inject(),

  init() {
    this._super(...arguments);

    let slidesService = this.get('slidesService');

    slidesService.on('change', () => {
      this.set('slide', slidesService.get('current.name'));
    });
  }
});
