(function () {
  'use strict';

  class Gl {
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
  }

  var fragmentShaderSource = "#version 300 es\nprecision mediump float;out vec4 color;in vec3 fragColor;void main(){color=vec4(fragColor,1.);}";

  var vertexShaderSource = "#version 300 es\nin vec2 a_position;in vec3 a_vertColor;uniform float uPointSize;out vec3 fragColor;void main(){fragColor=a_vertColor;gl_PointSize=uPointSize;gl_Position=vec4(a_position,0.,1.);}";

  const deleteShader = ({ context, program, shader }) => {
    context.detachShader(program, shader);
    context.deleteShader(shader);
  };

  const createShader = ({ context, type, source }) => {
    const shader = context.createShader(type);

    context.shaderSource(shader, source);
    context.compileShader(shader);

    const success = context.getShaderParameter(shader, context.COMPILE_STATUS);

    if (!success) {
      const infoLog = context.getShaderInfoLog(shader);
      context.deleteShader(shader);
      throw infoLog;
    }

    return shader;
  };

  const validateProgram = ({ context, program }) => {
    context.validateProgram(program);
    const success = context.getProgramParameter(program, context.VALIDATE_STATUS);

    if (!success) {
      const infoLog = context.getProgramInfoLog(program);
      context.deleteProgram(program);
      throw infoLog;
    }
  };

  const createProgram = ({ context, vertexShader, fragmentShader, validate = false }) => {
    const program = context.createProgram();

    context.attachShader(program, vertexShader);
    context.attachShader(program, fragmentShader);
    context.linkProgram(program);

    const success = context.getProgramParameter(program, context.LINK_STATUS);

    if (!success) {
      const infoLog = context.getProgramInfoLog(program);
      context.deleteProgram(program);
      throw infoLog;
    }

    if (validate) {
      validateProgram({ context, program });
    }

    deleteShader({ context, program, shader: fragmentShader });
    deleteShader({ context, program, shader: vertexShader });

    return program;
  };

  // prettier-ignore
  var trianglePoints = new Float32Array([
    // X, Y      R, G, B
    -1, -1,      1, 0, 0,
     0,  1,      0, 1, 0,
     1, -1,      0, 0, 1
  ]);

  const gl = new Gl({ canvasSelector: '#webGl' });
  const { context } = gl;
  gl.setSize({ width: 500, height: 500 });
  gl.clear();

  const vertexShader = createShader({
    context,
    type: context.VERTEX_SHADER,
    source: vertexShaderSource,
  });

  const fragmentShader = createShader({
    context,
    type: context.FRAGMENT_SHADER,
    source: fragmentShaderSource,
  });

  const program = createProgram({
    context,
    vertexShader,
    fragmentShader,
    validate: true,
  });

  const aPositionLoc = context.getAttribLocation(program, 'a_position');
  const aVertColorLoc = context.getAttribLocation(program, 'a_vertColor');
  const uPointSizeLoc = context.getUniformLocation(program, 'uPointSize');

  const vertsBuffer = context.createBuffer();

  context.bindBuffer(context.ARRAY_BUFFER, vertsBuffer);
  context.bufferData(context.ARRAY_BUFFER, trianglePoints, context.STATIC_DRAW);

  const size = 2; // components per iteration
  const colorSize = 3;
  const type = context.FLOAT; // the data is 32bit floats
  const normalize = context.FALSE; // don't normalize the data
  const stride = 5 * Float32Array.BYTES_PER_ELEMENT; // 0 means iterate size * sizeof(type) to get next index
  const offset = 0; // start at the beginning of the buffer
  const colorOffset = 2 * Float32Array.BYTES_PER_ELEMENT;
  context.useProgram(program);
  context.uniform1f(uPointSizeLoc, 10);

  gl.setClearColor({ r: 0, g: 0, b: 0, a: 1 });
  gl.clear();

  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
  context.vertexAttribPointer(aPositionLoc, size, type, normalize, stride, offset);
  context.vertexAttribPointer(aVertColorLoc, colorSize, type, normalize, stride, colorOffset);
  context.enableVertexAttribArray(aVertColorLoc);
  context.enableVertexAttribArray(aPositionLoc);

  context.drawArrays(context.TRIANGLES, 0, 3);
  context.drawArrays(context.POINTS, 0, 3);
  context.bindBuffer(context.ARRAY_BUFFER, null);

}());
