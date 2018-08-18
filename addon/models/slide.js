import Object, { computed } from '@ember/object';

export default Object.extend({
  path: undefined,
  parent: undefined,
  config: undefined,

  componentName: computed('path', 'parent', function() {
    let path = this.get('path');
    let parent = this.get('parent');

    return path.replace(`${parent}.`, '');
  }),

  containerPath: computed('path', function() {
    return this.get('path').replace(/\./g, '/');
  }),

  getRoleComponentPaths(role) {
    return [
      `slides/${this.get('componentName')}/${role.name}`,
      `slides/${role.name}/${this.get('componentName')}`,
    ];
  },
});
