export default class Scene {
  constructor() {
    this._children = [];
  }

  add(...meshes) {
    this._children.push(...meshes);
  }

  render(context) {
    this._children.forEach(child => {
      child.render();
      context.drawArrays(context.TRIANGLES, 0, child.vertCount);
    });
  }
}