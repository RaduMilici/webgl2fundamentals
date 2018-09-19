(function () {
  'use strict';

  const vertexShaderSource = `#version 300 es
in vec4 a_position;

void main() {
  gl_Position = a_position;
}`;

  const fragmentShaderSource = `#version 300 es
precision mediump float;
out vec4 outColor;

void main() {
  outColor = vec4(0, 1, 0, 1);
}
`;

  const createShader = (gl, type, source) => {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

    if (!success) {
      const infoLog = gl.getShaderInfoLog(shader);
      console.error(infoLog);
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  const createProgram = (gl, vertexShader, fragmentShader) => {
    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);

    if (!success) {
      const infoLog = gl.getProgramInfoLog(program);
      console.error(infoLog);
      gl.deleteProgram(program);
      return null;
    }

    return program;
  };

  const resize = canvas => {
    const { clientWidth, clientHeight } = canvas;
    canvas.width = clientWidth;
    canvas.height = clientHeight;
  };

  const trianglePoints = [
    -1, 1,
    1, 1,
    0, -1
  ];

  var trianglePoints$1 = new Float32Array(trianglePoints);

  // context
  const canvas = document.querySelector('#webGl');
  resize(canvas);
  const gl = canvas.getContext('webgl2');
  // shaders and program
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = createProgram(gl, vertexShader, fragmentShader);
  // attribute and buffer
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, trianglePoints$1, gl.STATIC_DRAW);
  // vao
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.enableVertexAttribArray(positionAttributeLocation);
  /*
  A hidden part of gl.vertexAttribPointer is that it binds the current ARRAY_BUFFER to the attribute.
  In other words now this attribute is bound to positionBuffer. That means we're free to bind something
  else to the ARRAY_BUFFER bind point. The attribute will continue to use positionBuffer.
   */
  const size = 2;          // 2 components per iteration (2d points)
  const type = gl.FLOAT;   // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0;        // 0 means iterate size * sizeof(type) to get next index
  const offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
  // viewport
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

}());
