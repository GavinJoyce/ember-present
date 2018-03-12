import Service, { inject } from '@ember/service';
import { readOnly, notEmpty, not } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Service.extend({
  config: inject(),
  router: inject(),
  realtime: inject(),

  user: undefined,
  isAuthenticated: notEmpty('user'),
  isNotAuthenticated: not('user'),

  isConnected: false,
  isReconnecting: false,
  isLoggingIn: readOnly('loginTask.isRunning'),

  init() {
    this._super(...arguments);

    let realtime = this.get('realtime');

    realtime.on('connect', () => {
      this.set('isConnected', true);
    });

    realtime.on('disconnect', () => {
      this.set('isConnected', false);
    });

    realtime.on('reconnecting', () => {
      this.set('isReconnecting', true);
    });

    realtime.on('reconnect', () => {
      this.set('isConnected', true);
      this.set('isReconnecting', false);

      let user = this.get('user');
      if (user) {
        return this.get('reconnectWithTokenTask').perform(user.token);
      }
    });

    realtime.on('userMetadataUpdated', (metadata) => {
      this.set('user.metadata', metadata)
    });
  },

  actions: {
    login(username, password) {
      return this.get('loginTask').perform(username, password);
    }
  },

  loginTask: task(function * (username, password) {
    let realtime = this.get('realtime');
    let response = yield realtime.emitWithResponse('login', { username, password });
    this._handleResponse(response);
  }),

  reconnectWithTokenTask: task(function * (token) {
    let realtime = this.get('realtime');
    let response = yield realtime.emitWithResponse('reconnectWithToken', { token });
    this._handleResponse(response);
  }),

  _handleResponse(response) {
    if (response.isSuccess) {
      this.set('user', response.user);

      //TODO: GJ: persist token to cookies so that reloading the app works?
      this.get('router').transitionTo(`auth.${response.user.role}`, { queryParams: { slide: response.currentSlide } });
    } else {
      this.set('user', undefined);
      this.set('invalidLogin', true);
      this.get('router').transitionTo('login');
    }
  }
});
