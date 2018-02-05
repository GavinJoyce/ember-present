import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  session: inject(),

  activate() {
    this._super(...arguments);

    if(!this.get('session.isAuthenticated')) { //TODO: GJ: requiresAuthentication
      this.transitionTo('login');
    }
  }
});
