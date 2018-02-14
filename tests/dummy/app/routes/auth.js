import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Route.extend({
  slides: inject(),
  session: inject(),
  config: inject(),
  configuration: readOnly('config.emberPresent'),

  queryParams: {
    slide: {
      replace: true
    }
  },

  beforeModel({ queryParams, targetName }) {
    this.set('targetName', targetName);
    this.get('slides').setupRole('presenter');

    if (queryParams.slide) {
      this.get('slides').goToSlide(queryParams.slide);
    }
  },

  activate() {
    this._super(...arguments);

    if(!this.get('session.isAuthenticated')) { //TODO: GJ: requiresAuthentication
      let roles = this.get('configuration.roles'); //TODO: GJ: create better config service
      let targetName = this.get('targetName');

      let role = Object.values(roles).find(r => r.route === targetName) || {};
      this.transitionTo('login', { queryParams: { role: role.name }});
    }
  }
});
