import { helper } from '@ember/component/helper';
import { getOwner } from '@ember/application';

export function updateUserData([key, value]) {
  return function() {
    let realtime = getOwner(this).lookup('service:realtime');

    let data = {};
    data[key] = value;

    realtime.emit('updateUserMetadata', data);
  };
}

export default helper(updateUserData);
