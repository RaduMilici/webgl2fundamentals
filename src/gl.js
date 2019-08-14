export default class Gl {
  constructor({ canvasSelector }) {
    this.canvas = document.querySelector(canvasSelector);

    if (!this.canvas instanceof HTMLCanvasElement) {
      throw `Can't find canvas with selector ${canvasSelector}.`;
    }

    this.context = this.canvas.getContext('webgl2');
    this.setClearColor({ r: 1, g: 1, b: 1, a: 1 });
  }

  setSize({ width, height }) {
    this.context.canvas.style.width = `${width}px`;
    this.context.canvas.style.height = `${height}px`;
    this.context.canvas.width = width;
    this.context.canvas.height = height;
    this.context.viewport(0, 0, width, height);
  }

  setClearColor({ r, g, b, a }) {
    this.context.clearColor(r, g, b, a);
  }

  clear() {
    this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
  }

  render(scene) {
    scene.render(this.context);
  }
}
