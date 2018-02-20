import Service from '@ember/service';
import Realtime from 'ember-present/mixins/realtime';

export default Service.extend(Realtime, {
  statistics: undefined,

  async init() {
    this._super(...arguments);

    this.set('statistics', { });

    this.addRealtimeListener('userStastics', (statistics) => {
      this.set('statistics', statistics);
    });

    let statistics = await this.get('realtime').emitWithResponse('getUserStatistics');
    this.set('statistics', statistics);
  }
});
