import { OrthographicProjectionMatrix } from './matrices';

export default class Renderer {
  constructor({ canvasSelector, size, clearColor }) {
    this.canvas = document.querySelector(canvasSelector);

    if (!this.canvas instanceof HTMLCanvasElement) {
      throw `Can't find canvas with selector ${canvasSelector}.`;
    }

    this.context = this.canvas.getContext('webgl2');
    const { width, height, depth } = size;
    this.setSize({ width, height });
    this.setClearColor(clearColor);
    //this._projectionMatrix = new ProjectionMatrix({ width, height, depth });
    this._projectionMatrix = new OrthographicProjectionMatrix({
      left: 0,
      right: width,
      bottom: height,
      top: 0,
      near: 400,
      far: -400,
    });
    console.log(this._projectionMatrix);
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

  render(...scenes) {
    this.clear();
    scenes.forEach(scene =>
      scene._renderChildren({
        projectionMatrix: this._projectionMatrix,
      })
    );
  }
}
