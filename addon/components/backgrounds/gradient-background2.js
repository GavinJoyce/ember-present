import Component from '@ember/component';

export default Component.extend({
  classNames: 'gradient-background',

  init() {
    this._super(...arguments);

    let colors = this.get('colors');
    if (colors === undefined) {
      this.set('colors', ['#e66465', '#9198e5'])
    }
  },

  didInsertElement() {
    this._super(...arguments);

    let colors = this.get('colors');
    this.$()[0].style['background-image'] = `linear-gradient(-15deg, ${colors.join(',')})`;
  },
});
