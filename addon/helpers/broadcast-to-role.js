import { helper } from '@ember/component/helper';
import { getOwner } from '@ember/application';

export function broadcastToRole([role, name]) {
  return function(data) {
    let realtime = getOwner(this).lookup('service:realtime');
    realtime.broadcastToRole(role, name, data);
  };
}

export default helper(broadcastToRole);
