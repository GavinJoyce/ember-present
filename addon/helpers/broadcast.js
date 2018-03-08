import { helper } from '@ember/component/helper';
import { getOwner } from '@ember/application';

export function broadcast([prop, ...values]) {
  return function() {
    let realtime = getOwner(this).lookup('service:realtime');
    realtime.broadcast(prop, ...values);
  };
}

export default helper(broadcast);
