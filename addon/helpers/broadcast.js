import { helper } from '@ember/component/helper';
import { getOwner } from '@ember/application';

export function broadcast([name, data]) {
  return function() {
    let realtime = getOwner(this).lookup('service:realtime');
    realtime.broadcast(name, data);
  };
}

export default helper(broadcast);
