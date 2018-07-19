import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

const routerServiceStub = Service.extend({
  currentRouteName: ''
});

module('Unit | Service | slides', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:router', routerServiceStub);
  });

  test('registerSlide', function(assert) {
    let service = this.owner.lookup('service:slides');

    assert.equal(service.get('slideRoutes.length'), 0, 'there are no slides by default');

    service.registerSlide('slide-1');

    assert.equal(service.get('slideRoutes.length'), 1);
    assert.equal(service.get('slideRoutes.0.path'), 'slide-1');
    assert.deepEqual(service.get('slideRoutes.0.config'), {});

    service.registerSlide('slide-2', { theme: 'fire' });

    assert.equal(service.get('slideRoutes.length'), 2);
    assert.equal(service.get('slideRoutes.1.path'), 'slide-2');
    assert.deepEqual(service.get('slideRoutes.1.config'), { theme: 'fire' });
  });

  test('slidePaths and slideCount', function(assert) {
    let service = this.owner.lookup('service:slides');

    assert.deepEqual(service.get('slidePaths'), []);
    assert.deepEqual(service.get('slideCount'), 0);

    service.registerSlide('slide-1');
    service.registerSlide('slide-2');

    assert.deepEqual(service.get('slidePaths'), ['slide-1', 'slide-2']);
    assert.deepEqual(service.get('slideCount'), 2);
  });

  test('currentSlideIndex, currentSlideNumber, currentSlidePath, currentSlide and friends', function(assert) {
    let service = this.owner.lookup('service:slides');

    assert.deepEqual(service.get('previousSlideIndex'), 0);

    service.registerSlide('slide-1');
    service.registerSlide('slide-2');
    service.registerSlide('slide-3');

    service.set('currentRouteName', 'slide-1');

    assert.deepEqual(service.get('currentSlidePath'), 'slide-1');
    assert.deepEqual(service.get('currentSlide.path'), 'slide-1');
    assert.deepEqual(service.get('currentSlideIndex'), 0);
    assert.deepEqual(service.get('currentSlideNumber'), 1);
    assert.deepEqual(service.get('previousSlideIndex'), 0);
    assert.deepEqual(service.get('previousSlide.path'), 'slide-1');
    assert.deepEqual(service.get('hasPreviousSlide'), false);
    assert.deepEqual(service.get('hasNextSlide'), true);
    assert.deepEqual(service.get('nextSlideIndex'), 1);
    assert.deepEqual(service.get('nextSlide.path'), 'slide-2');

    service.set('currentRouteName', 'slide-2');

    assert.deepEqual(service.get('currentSlidePath'), 'slide-2');
    assert.deepEqual(service.get('currentSlide.path'), 'slide-2');
    assert.deepEqual(service.get('currentSlideIndex'), 1);
    assert.deepEqual(service.get('currentSlideNumber'), 2);
    assert.deepEqual(service.get('previousSlideIndex'), 0);
    assert.deepEqual(service.get('previousSlide.path'), 'slide-1');
    assert.deepEqual(service.get('hasPreviousSlide'), true);
    assert.deepEqual(service.get('hasNextSlide'), true);
    assert.deepEqual(service.get('nextSlideIndex'), 2);
    assert.deepEqual(service.get('nextSlide.path'), 'slide-3');

    service.set('currentRouteName', 'slide-3');

    assert.deepEqual(service.get('currentSlidePath'), 'slide-3');
    assert.deepEqual(service.get('currentSlide.path'), 'slide-3');
    assert.deepEqual(service.get('currentSlideIndex'), 2);
    assert.deepEqual(service.get('currentSlideNumber'), 3);
    assert.deepEqual(service.get('previousSlideIndex'), 1);
    assert.deepEqual(service.get('previousSlide.path'), 'slide-2');
    assert.deepEqual(service.get('hasPreviousSlide'), true);
    assert.deepEqual(service.get('hasNextSlide'), false);
    assert.deepEqual(service.get('nextSlideIndex'), 2);
    assert.deepEqual(service.get('nextSlide.path'), 'slide-3');

    service.set('currentRouteName', 'not-a-slide');

    assert.deepEqual(service.get('currentSlidePath'), undefined);
    assert.deepEqual(service.get('currentSlide'), undefined);
    assert.deepEqual(service.get('currentSlideIndex'), undefined);
    assert.deepEqual(service.get('currentSlideNumber'), undefined);
    assert.deepEqual(service.get('previousSlideIndex'), 0);
    assert.deepEqual(service.get('previousSlide.path'), 'slide-1');
    assert.deepEqual(service.get('hasPreviousSlide'), false);
    assert.deepEqual(service.get('hasNextSlide'), false);
    assert.deepEqual(service.get('nextSlideIndex'), undefined);
    assert.deepEqual(service.get('nextSlide'), undefined);
  });
});
