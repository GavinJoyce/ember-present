import Component from '@ember/component';
import layout from '../templates/components/x-video-slide';
import Realtime from '../mixins/realtime';
import { task, timeout } from 'ember-concurrency';

export default Component.extend(Realtime, {
  layout,
  tagName: 'video',
  attributeBindings: ['preload', 'autoplay'],

  index: 0,
  sections: undefined,
  autoplay: Ember.computed.empty('sections'),
  preload: true,

  didInsertElement() {
    this._super(...arguments);

    this.addRealtimeListener('videoNext', () => this.get('next').perform());
    this.get('next').perform();
  },

  next: task(function * () {
    this.get('stop').cancelAll();

    let video = this.$()[0];
    video.pause();

    let index = this.get('index');
    let section = this.get('sections')[index];

    if(section) {
      video.currentTime = section.start;
      video.play();
      this.incrementProperty('index');

      yield this.get('stop').perform((section.end - section.start) * 1000);
    } else {
      console.log('could not find ', index);
      yield false;
    }
  }),

  stop: task(function * (delay) {
    yield timeout(delay);
    this.$()[0].pause();
  }).drop()
});
