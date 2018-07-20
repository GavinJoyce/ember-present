const _ = require('lodash');

//see https://github.com/lodash/lodash/issues/2403#issuecomment-290760787
module.exports = function memoizedThrottle(fn, wait=1000) {
  var memoized = _.memoize(() => _.throttle(fn, wait));
  return function() {
    memoized.apply(this, arguments).apply(this, arguments);
  }
};
