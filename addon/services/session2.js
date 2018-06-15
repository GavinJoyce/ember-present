import Service, { inject } from '@ember/service';
import { notEmpty, not } from '@ember/object/computed';

export default Service.extend({
  router: inject(),
  slides2: inject(),

  user: undefined,
  role: 'screen',
  isAuthenticated: notEmpty('user'),
  isNotAuthenticated: not('user'),

  actions: {
    login(username, role) {
      this.set('user', username); //this will soon be an object
      this.set('role', role);
      this.get('slides2').first();
    }
  },
});
