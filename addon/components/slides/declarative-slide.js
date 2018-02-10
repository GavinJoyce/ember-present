import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { inject } from '@ember/service';
import layout from '../../templates/components/slides/declarative-slide';

export default Component.extend({
  layout,

  slides: inject(),

  componentData: computed('slides.roleIdentifier', 'slide', function() {
    let slide = this.get('slide');
    let roleIdentifier = this.get('slides.roleIdentifier');

    return get(slide, `roles.${roleIdentifier}.componentData`);
  })
});
