import Component from '@ember/component';
import { computed } from '@ember/object';
import move from 'ember-animated/motions/move';
import scale from 'ember-animated/motions/scale';

import model from '../../../models/data';

export default Component.extend({
  init() {
    this._super(...arguments);
    this.set('model', model);
  },

  transition: function * ({ keptSprites, sentSprites, receivedSprites }) {
    keptSprites.forEach(move);
    sentSprites.forEach(move);
    receivedSprites.forEach(sprite => sprite.moveToFinalPosition());
    yield;
  },

  transition2: function * ({ sentSprites, receivedSprites }) {
    yield sentSprites.forEach(sprite => {
      scale(sprite);
      move(sprite);
    });

    yield receivedSprites.forEach(sprite => {
      scale(sprite);
      move(sprite);
    });
  },

  leftItems: computed(function() {
    let result = [];
    for (let i = 0; i < 5; i++) {
      result.push(makeRandomItem());
    }
    return result.sort(numeric);
  }),

  rightItems: computed(function() {
    let result = [];
    for (let i = 0; i < 5; i++) {
      result.push(makeRandomItem());
    }
    return result.sort(numeric);
  }),

  actions: {
    move(item) {
      let rightItems = this.get('rightItems');
      let leftItems = this.get('leftItems');
      let index = rightItems.indexOf(item);
      if (index !== -1) {
        this.set('rightItems', rightItems.slice(0, index).concat(rightItems.slice(index+1)));
        this.set('leftItems', leftItems.concat([item]).sort(numeric));
      } else {
        index = leftItems.indexOf(item);
        this.set('leftItems', leftItems.slice(0, index).concat(leftItems.slice(index+1)));
        this.set('rightItems', rightItems.concat([item]).sort(numeric));
      }
    },
    moveRandomLeft() {
      let randomItem = getRandomItem(this.get('leftItems'));
      this.send('move', randomItem);
    },
    moveRandomRight() {
      let randomItem = getRandomItem(this.get('rightItems'));
      this.send('move', randomItem);
    }
  }
});

function numeric(a,b) { return a.id - b.id; }

function makeRandomItem() {
  return { id: Math.round(Math.random()*1000) };
}

function getRandomItem(items) {
  return items[Math.floor(Math.random()*items.length)];
}