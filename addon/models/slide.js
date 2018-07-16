import Object, { computed } from '@ember/object';

export default Object.extend({
  path: undefined,
  config: undefined,

  componentName: computed('containerPath', function() { //TODO: GJ: improve how we determine the component name
    let containerPath = this.get('containerPath');
    return containerPath.replace('slides/auth.', '');
  }),

  containerPath: computed('path', function() {
    return this.get('path').replace('.', '/');
  }),
});
