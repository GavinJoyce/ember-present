import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  slides: inject(),
  session: inject(),

  queryParams: {
    slide: {
      replace: true
    }
  },

  beforeModel({ queryParams }) {
    if (queryParams.slide) {
      this.get('slides').goToSlide(queryParams.slide);
    }
  },

  activate() {
    this._super(...arguments);

    if(!this.get('session.isAuthenticated')) { //TODO: GJ: requiresAuthentication
      this.transitionTo('login');
    }
  }
});
