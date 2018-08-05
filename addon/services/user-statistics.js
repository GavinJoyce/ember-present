import Service from '@ember/service';
import Realtime from 'ember-present/mixins/realtime';

export default Service.extend(Realtime, {
  async init() {
    this._super(...arguments);

    this.addRealtimeListener('userStastics', (statistics) => {
      this.setProperties(statistics);
    });

    let statistics = await this.get('realtime').emitWithResponse('getUserStatistics');
    this.setProperties(statistics);
  }
});
