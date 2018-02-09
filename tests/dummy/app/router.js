import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('all');

  this.route('login');

  this.route('auth', { path: '/' }, function() {
    this.route('screen');
    this.route('presenter');
    this.route('notes');
    this.route('audience');
  });
});

export default Router;
