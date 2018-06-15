import config from './config/environment';
import EmberPresentRouter from 'ember-present/routing/router';

const Router = EmberPresentRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
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

  this.route('slides', function() {
    this.role('screen');
    this.role('presenter');
    this.role('audience');

    this.route('login');

    this.route('auth', { path: '/' }, function() {
      this.slide('slide-1', { transition: 'slide' });
      this.slide('slide-2', { transition: 'slide' });
      this.slide('slide-3', { transition: 'fade' });
      this.slide('slide-4');
      this.slide('slide-5');
    });
  });
});

export default Router;
