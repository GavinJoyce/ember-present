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

  describe('#disconnect', function() {
    describe('a logged in user', function() {
      it('disconnects the user', function() {
        let { user } = store.login('Alex', undefined, 'socket-id');
        assert.equal(store.connectedUserCount, 1);
        assert.equal(store.disconnectedUserCount, 0);
        store.disconnect('socket-id');
        assert.equal(store.connectedUserCount, 0);
        assert.equal(store.disconnectedUserCount, 1);
      });
    });

    describe('a non-logged in user', function() {
      it('is a no-op', function() {
        let { user } = store.login('Alex', undefined, 'socket-id');
        assert.equal(store.connectedUserCount, 1);
        assert.equal(store.disconnectedUserCount, 0);
        store.disconnect('non-existent-socket-id');
        assert.equal(store.connectedUserCount, 1);
        assert.equal(store.disconnectedUserCount, 0);
      });
    });
  });

  describe('#reconnectWithToken', function() {
    describe('a user with a valid token', function() {
      it('reconnects the user', function() {
        let { user } = store.login('Alex', undefined, 'socket-id');
        store.disconnect('socket-id');

        let response = store.reconnectWithToken(user.token, 'new-socket-id');
        assert.equal(store.connectedUserCount, 1);
        assert.equal(store.disconnectedUserCount, 0);

        assert.equal(user.socketId, 'new-socket-id', 'the user socket id was updated');
        assert.ok(response.isSuccess, 'The reconnection was successful');
      });
    });

    describe('a user with an invalid token', function() {
      it('is not succesful', function() {
        let { user } = store.login('Alex', undefined, 'socket-id');
        store.disconnect('socket-id');

        let response = store.reconnectWithToken('invalid token', 'new-socket-id');
        assert.equal(store.connectedUserCount, 0);
        assert.equal(store.disconnectedUserCount, 1);

        assert.equal(user.socketId, 'socket-id', 'the user socket id was not updated');
        assert.ok(!response.isSuccess, 'The reconnection was not successful');
      });
    });
  });

  describe('#mergeUserMetadata', function() {
    describe('a logged in user', function() {
      it('merges the user metadata', function() {
        let { user } = store.login('Alex', undefined, 'socket-id');
        assert.deepEqual(user.metadata, {});

        let metadata = store.mergeUserMetadata('socket-id', { favouriteColour: 'red' });
        assert.deepEqual(metadata, { favouriteColour: 'red' });

        metadata = store.mergeUserMetadata('socket-id', { age: 3 });
        assert.deepEqual(metadata, { favouriteColour: 'red', age: 3 });

        metadata = store.mergeUserMetadata('socket-id', { favouriteColour: 'blue', age: 4 });
        assert.deepEqual(metadata, { favouriteColour: 'blue', age: 4 });
      });
    });

    describe('a logged out user', function() {
      it('does not throw an exception', function() {
        let response = store.mergeUserMetadata('invalid-socket-id', { favouriteColour: 'red' });
        assert.equal(response, undefined);
      });
    });
  });

  describe('#getMetadataSummary', function() {
    it('returns summary data', function() {
      store.login('Alex', undefined, 'alex-socket');
      store.login('Ben', undefined, 'ben-socket');
      store.login('Sophie', undefined, 'sophie-socket');
      store.login('Sarah', undefined, 'sarah-socket');

      store.mergeUserMetadata('alex-socket', { favouriteColour: 'purple' });
      store.mergeUserMetadata('ben-socket', { favouriteColour: 'blue' });
      store.mergeUserMetadata('sophie-socket', { favouriteColour: 'blue' });

      let summary = store.getMetadataSummary('favouriteColour');
      assert.deepEqual(summary, {
        'Alex': 'purple',
        'Ben': 'blue',
        'Sophie': 'blue'
      });
    });
  });

  describe('#getUsersByMetadata', function() {
    it('returns the correct users', function() {
      let alex = store.login('Alex', undefined, 'alex').user;
      let ben = store.login('Ben', undefined, 'ben').user;
      let sophie = store.login('Sophie', undefined, 'sophie').user;

      store.mergeUserMetadata('alex', { favouriteColour: 'purple' });
      store.mergeUserMetadata('ben', { favouriteColour: 'blue' });
      store.mergeUserMetadata('sophie', { favouriteColour: 'blue' });

      let matchingUsers = store.getUsersByMetadata('favouriteColour', 'blue');
      assert.deepEqual(matchingUsers, [ben, sophie]);

      matchingUsers = store.getUsersByMetadata('favouriteColour', 'purple');
      assert.deepEqual(matchingUsers, [alex]);

      matchingUsers = store.getUsersByMetadata('favouriteColour', 'nothing');
      assert.deepEqual(matchingUsers, []);

      matchingUsers = store.getUsersByMetadata('somethingMissing', 'nothing');
      assert.deepEqual(matchingUsers, []);
    });
  });

  describe('#clearMetadataByValue', function() {
    it('clears user metadata', function() {
      let alex = store.login('Alex', undefined, 'alex').user;
      let ben = store.login('Ben', undefined, 'ben').user;
      let sophie = store.login('Sophie', undefined, 'sophie').user;
      store.mergeUserMetadata('alex', { favouriteColour: 'purple' });
      store.mergeUserMetadata('ben', { favouriteColour: 'purple' });
      store.mergeUserMetadata('sophie', { favouriteColour: 'blue' });

      let matchingUsers = store.getUsersByMetadata('favouriteColour', 'purple');
      assert.deepEqual(matchingUsers, [alex, ben]);

      store.clearMetadataByValue('favouriteColour', 'purple');

      matchingUsers = store.getUsersByMetadata('favouriteColour', 'purple');
      assert.deepEqual(matchingUsers, []);

      matchingUsers = store.getUsersByMetadata('favouriteColour', 'blue');
      assert.deepEqual(matchingUsers, [sophie]);
    });
  });
});
