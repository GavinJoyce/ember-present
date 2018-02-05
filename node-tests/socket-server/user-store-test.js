const UserStore = require('../../socket-server/user-store');
const assert = require('assert');

describe('UserStore', function() {
  let store;

  beforeEach(function() {
    store = new UserStore({
      roles: {
        presenter: { password: 'presenter-password' },
        notes: { password: 'notespassword' },
        screen: { password: 'screenpassword' },
        audience: {}
      }
    });
  });

  describe('#login', function() {
    describe('valid credentials', function() {
      it('allows the audience to login', function() {
        let { user } = store.login('Alex', undefined, 'socket-id');

        assert.equal(user.username, 'Alex');
        assert.equal(user.role, 'audience');
        assert.equal(user.socketId, 'socket-id');
        assert.ok(user.token, 'the user has a token');
        assert.equal(store.connectedUserCount, 1);
      });

      it('allows the presenter to login', function() {
        let { user } = store.login('Gavin', 'presenter-password', 'socket-id');

        assert.equal(user.username, 'Gavin');
        assert.equal(user.role, 'presenter');
        assert.equal(user.socketId, 'socket-id');
        assert.ok(user.token, 'the user has a token');
        assert.equal(store.connectedUserCount, 1);
      });
    });

    describe('invalid credentials', function() {
      it('does not succeed if the username is already taken', function() {
        let response = store.login('Alex', undefined, 'socket-id-1');
        assert.ok(response.isSuccess, 'The login is successful');

        response = store.login('Alex', undefined, 'socket-id-2');
        assert.ok(!response.isSuccess, 'The login is not successful');
        assert.equal(store.connectedUserCount, 1);
      });

      it('does not succeed with bad password', function() {
        let response = store.login('Ben', 'bad-password', 'socket-id');

        assert.ok(!response.isSuccess, 'The login is not successful');
        assert.equal(store.connectedUserCount, 0);
      });

      //TODO: also for disconnectedUsers
    });
  });
});
