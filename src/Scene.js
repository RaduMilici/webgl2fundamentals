import { uniqueId } from 'pulsar-pathfinding';

export default class Scene {
  constructor() {
    this.id = uniqueId();
    this._objects = [];
  }

  add(...objects) {
    objects.forEach(object => {
      if (!this.contains(object)) {
        this._objects.push(object);
      }
    });
  }

  remove(...objects) {
    objects.forEach(object => {
      const index = this._getChildIndex(object);

      if (index !== -1) {
        this._objects.splice(index, 1);
      }
    });
  }

  clear() {
    this._objects.length = 0;
  }

  contains(object) {
    return this._getChildIndex(object) !== -1;
  }

  _renderChildren() {
    this._objects.forEach(child => child._renderImmediate());
  }

  _getChildIndex(object) {
    return this._objects.indexOf(object);
  }
}
