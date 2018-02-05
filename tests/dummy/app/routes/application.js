import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  slides: inject(),
  socketIo: inject(), //TODO: GJ: zap?

  queryParams: {
    slide: {
      replace: true
    }
  },

  beforeModel({ queryParams }) {
    if (queryParams.slide) {
      this.get('slides').goToSlide(queryParams.slide);
    }
  }
});
