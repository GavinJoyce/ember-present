import EmberRouter from '@ember/routing/router';
import { inject as service } from '@ember/service';

export default EmberRouter.extend({
  slides: service(),

  _buildDSL() {
    let dsl = this._super(...arguments);
    let slides = this.get('slides');
    let dslPrototype = Object.getPrototypeOf(dsl);

    dslPrototype.slide = function() {
      let name = arguments[0];
      let config = arguments[1]; //TODO: GJ: this should be optional and should follow similiar rules to EmberRouter
      let parent = this.parent;
      let path;

      if (parent === 'application') {
        path = name
      } else {
        path = `${parent}.${name}`;
      }

      slides.registerSlide(path, parent, config);
      dslPrototype.route.apply(this, arguments);
    };

    dslPrototype.role = function(name, config = {}) {
      slides.registerRole(name, config);
    };

    return dsl;
  }
});
