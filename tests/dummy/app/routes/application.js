import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  slidesService: inject(),

  beforeModel({ queryParams }) {
    if (queryParams.slide) {
      this.get('slidesService').goToSlide(queryParams.slide);
    }
  }
});
