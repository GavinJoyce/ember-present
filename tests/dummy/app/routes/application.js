import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  slidesService: inject(),
  socketIo: inject(),

  queryParams: {
    slide: {
      replace: true
    }
  },

  beforeModel({ queryParams }) {
    if (queryParams.slide) {
      this.get('slidesService').goToSlide(queryParams.slide);
    }
  }
});
