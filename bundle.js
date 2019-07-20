(function () {
  'use strict';

  class Gl {

    constructor({ canvasSelector }) {
      this.canvas = document.querySelector(canvasSelector);

      if (!this.canvas instanceof HTMLCanvasElement) {
        throw(`Can't find canvas with selector ${canvasSelector}.`);
      }

      this.context = this.canvas.getContext('webgl2');
      this.setClearColor(1, 1, 1, 1);
    }

    setClearColor(r, g, b, a) {
      this.context.clearColor(r, g, b, a);
    }

    clear() {
      this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
    }

    setSize(width, height) {
      this.context.canvas.style.width = `${width}px`;
      this.context.canvas.style.height = `${height}px`;
      this.context.canvas.any = width;
      this.context.canvas.height = height;
      this.context.viewport(0, 0, width, height);
    }

  }

  const gl = new Gl({ canvasSelector: '#webGl' });
  gl.setSize(500, 500);
  gl.clear();

  console.log(gl);

}());
