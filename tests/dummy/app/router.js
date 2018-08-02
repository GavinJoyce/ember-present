import config from './config/environment';
import EmberPresentRouter from 'ember-present/routing/router';

const Router = EmberPresentRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

Router.map(function() {
  this.route('all');
  this.route('screen-and-presenter');

  this.route('slides', function() {
    this.route('login');

    this.route('auth', { path: '/' }, function() {
      this.slide('s01-title', { transition: 'slide' }); //we may want to allow transitions per role. let's just assume `screen` for now
      this.slide('s02-code', { transition: 'slide' });
      this.slide('s03-video', { transition: 'slide' });
      this.slide('s04-tailwind', { transition: 'slide' });
      this.slide('s05-poll', { transition: 'slide' });
      this.slide('s06-pointer', { transition: 'slide' });
      this.slide('s07-ember-animated', { transition: 'slide' });
      this.slide('s08-ember-animated-2', { transition: 'nonw' });
    });
  });
});

export default Router;
