export default class Scene {
  constructor() {
    this._children = [];
  }

  add(...objects) {
    objects.forEach(object => {
      if (!this.contains(object)) {
        this._children.push(object);
      }
    });
  }

  remove(...objects) {
    objects.forEach(object => {
      const index = this._getChildIndex(object);

      if (index !== -1) {
        this._children.splice(index, 1);
      }
    });
  }

  contains(object) {
    return this._getChildIndex(object) !== -1;
  }

  render(context) {
    this._children.forEach(child => {
      child.render();
      context.drawArrays(context.TRIANGLES, 0, child.vertCount);
    });
  }

  _getChildIndex(object) {
    return this._children.indexOf(object);
  }
}
