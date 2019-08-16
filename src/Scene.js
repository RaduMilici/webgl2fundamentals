import { uniqueId, contains, removeFromArray } from 'pulsar-pathfinding';

export default class Scene {
  constructor() {
    this.id = uniqueId();
    this._objects = [];
  }

  add(...objects) {
    objects.forEach(object => {
      if (!contains(this._objects, object)) {
        this._objects.push(object);
      }
    });
  }

  remove(...objects) {
    objects.forEach(object => removeFromArray(this._objects, object));
  }

  clear() {
    this._objects.length = 0;
  }
  _renderChildren() {
    this._objects.forEach(child => child._renderImmediate());
  }

  _getChildIndex(object) {
    return this._objects.indexOf(object);
  }
}
