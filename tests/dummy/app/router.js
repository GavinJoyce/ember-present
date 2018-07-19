import config from './config/environment';
import EmberPresentRouter from 'ember-present/routing/router';

const Router = EmberPresentRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

Router.map(function() {
  this.route('all');
  this.route('all2');

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
      this.slide('slide-1', { transition: 'slide' }); //we may want to allow transitions per role. let's just assume `screen` for now
      this.slide('slide-2', { transition: 'slide' });
      this.slide('slide-3', { transition: 'slide' });
      this.slide('slide-4', { transition: 'slide' });
      this.slide('slide-5', { transition: 'slide' });
      this.slide('colour-poll', { transition: 'slide' });
    });
  });
});

export default Router;
