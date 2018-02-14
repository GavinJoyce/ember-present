import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
  queryParams: ['role'],

  session: inject()
});
