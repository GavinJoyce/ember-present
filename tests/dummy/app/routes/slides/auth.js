import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  slides: inject(),
  session: inject(),

  activate() {
    this._super(...arguments);

    if(!this.get('session.isAuthenticated')) {
      this.transitionTo('slides.login');
    }
  }
});
