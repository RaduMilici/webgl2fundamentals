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

  const vertexShaderSource = `#version 300 es
in vec3 a_position;
uniform float uPointSize;

void main() {
  gl_PointSize = uPointSize;
  gl_Position = vec4(a_position, 1.0);
}`;

  const fragmentShaderSource = `#version 300 es
precision mediump float;
out vec4 color;

void main() {
  color = vec4(0, 0, 1, 1);
}
`;

  const deleteShader = ({ gl, program, shader }) => {
    gl.detachShader(program, shader);
    gl.deleteShader(shader);
  };

  const createShader = ({ gl, type, source }) => {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

    if (!success) {
      const infoLog = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw infoLog;
    }

    return shader;
  };

  const validateProgram = ({ gl, program }) => {
    gl.validateProgram(program);
    const success = gl.getProgramParameter(program, gl.VALIDATE_STATUS);

    if (!success) {
      const infoLog = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw infoLog;
    }
  };

  const createProgram = ({ gl, vertexShader, fragmentShader, validate }) => {
    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);

    if (!success) {
      const infoLog = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw infoLog;
    }

    if (validate) {
      validateProgram({ gl, program });
    }

    deleteShader({ gl, program, shader: fragmentShader });
    deleteShader({ gl, program, shader: vertexShader });

    return program;
  };

  const gl = new Gl({ canvasSelector: '#webGl' });
  const { context } = gl;
  gl.setSize({ width: 500, height: 500 });
  gl.clear();

  const vertexShader = createShader({
    gl: context,
    type: context.VERTEX_SHADER,
    source: vertexShaderSource,
  });

  const fragmentShader = createShader({
    gl: context,
    type: context.FRAGMENT_SHADER,
    source: fragmentShaderSource,
  });

  const program = createProgram({
    gl: context,
    vertexShader,
    fragmentShader,
    validate: true,
  });

  context.useProgram(program);

  const aPositionLoc = context.getAttribLocation(program, 'a_position');
  const uPointSizeLoc = context.getUniformLocation(program, 'uPointSize');
  const vertsArray = new Float32Array([0, 0, 0.5, 0.5]);
  const vertsBuffer = context.createBuffer();

  context.bindBuffer(context.ARRAY_BUFFER, vertsBuffer);
  context.bufferData(context.ARRAY_BUFFER, vertsArray, context.STATIC_DRAW);
  context.enableVertexAttribArray(aPositionLoc);

  const size = 2; // 2 components per iteration 
  const type = context.FLOAT; // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0; // 0 means iterate size * sizeof(type) to get next index
  const offset = 0; // start at the beginning of the buffer
  context.vertexAttribPointer(aPositionLoc, size, type, normalize, stride, offset);
  context.bindBuffer(context.ARRAY_BUFFER, null);
  context.uniform1f(uPointSizeLoc, 10);
  context.drawArrays(context.POINTS, 0, 2);
  //context.useProgram(null);

  function random(min = 0, max = 1) {
    return Math.random() * (max - min) + min;
  }

  const animate = () => {
    gl.setClearColor({ r: random(), g: random(), b: random(), a: 1 });
    gl.clear();
    const posArray = [];
    const count = 500;
    for (let i = 0; i < count; i++) {
      const x = random(-1, 1);
      const y = random(-1, 1);
      posArray.push(x, y);
    }
    const floatArray = new Float32Array(posArray);
    context.bindBuffer(context.ARRAY_BUFFER, vertsBuffer);
    context.bufferData(context.ARRAY_BUFFER, floatArray, context.STATIC_DRAW);
    context.drawArrays(context.POINTS, 0, count);
    context.bindBuffer(context.ARRAY_BUFFER, null);
  };
  animate();
  //ßßsetInterval(animate, 1000);

}());
