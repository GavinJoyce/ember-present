import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  slides2: inject(),
  session2: inject(),

  activate() {
    this._super(...arguments);

    if(!this.get('session2.isAuthenticated')) {
      this.transitionTo('slides.login');
    }
  }
});
