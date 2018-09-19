(function () {
  'use strict';

  const pixelsVertexShaderSource = `#version 300 es
in vec2 a_position;
uniform vec2 u_resolution;

void main() {
  vec2 zeroToOne = a_position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  
  gl_Position = vec4(clipSpace, 0, 1);
}
`;

  const fragmentShaderSource = `#version 300 es
precision mediump float;
uniform vec4 u_color;
out vec4 outColor;

void main() {
  outColor = u_color;
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

  //# sourceMappingURL=clone.js.map

  //# sourceMappingURL=id.js.map

  //# sourceMappingURL=radDeg.js.map

  //# sourceMappingURL=number.js.map

  //# sourceMappingURL=Vector.js.map

  const round = (float) => (float + 0.5) | 0;
  const randomInt = (min, max) => {
      return round(randomFloat(min, max));
  };
  const randomFloat = (min, max) => {
      return Math.random() * (max - min) + min;
  };
  //# sourceMappingURL=random.js.map

  //# sourceMappingURL=sort.js.map

  //# sourceMappingURL=toFloat.js.map

  //# sourceMappingURL=uniqueID.js.map

  //# sourceMappingURL=index.js.map

  //# sourceMappingURL=Obstacles.js.map

  //# sourceMappingURL=NavigatorData.js.map

  //# sourceMappingURL=NavigatorTile.js.map

  //# sourceMappingURL=DisjoinedSet.js.map

  //# sourceMappingURL=Matrix.js.map

  //# sourceMappingURL=LineIntersection.js.map

  //# sourceMappingURL=Line.js.map

  //# sourceMappingURL=BoundingBox.js.map

  //# sourceMappingURL=Clock.js.map

  //# sourceMappingURL=Shape.js.map

  //# sourceMappingURL=Triangle.js.map

  //# sourceMappingURL=index.js.map

  //# sourceMappingURL=Grid.js.map

  //# sourceMappingURL=Navigator.js.map

  //# sourceMappingURL=index.js.map

  //# sourceMappingURL=Hull.js.map

  //# sourceMappingURL=MinimumSpanningTree.js.map

  //# sourceMappingURL=Triangulation.js.map

  //# sourceMappingURL=index.js.map

  //# sourceMappingURL=QuadTree.js.map

  //# sourceMappingURL=index.js.map

  //# sourceMappingURL=Component.js.map

  //# sourceMappingURL=Entity.js.map

  //# sourceMappingURL=EntityUpdater.js.map

  //# sourceMappingURL=Invoke.js.map

  //# sourceMappingURL=InvokeRepeating.js.map

  //# sourceMappingURL=Updater.js.map

  //# sourceMappingURL=index.js.map

  //# sourceMappingURL=index.js.map

  const resize = canvas => {
    const { clientWidth, clientHeight } = canvas;
    canvas.width = clientWidth;
    canvas.height = clientHeight;
  };

  const setRectangle = (gl, x, y, width, height) => {
    const x1 = x;
    const x2 = x + width;
    const y1 = y;
    const y2 = y + height;

    const array = new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2
    ]);

    gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
  };

  const trianglePoints = [
    0, 0,
    0, 200,
    200, 200
  ];

  var trianglePoints$1 = new Float32Array(trianglePoints);

  // context
  const canvas = document.querySelector('#webGl');
  resize(canvas);
  const gl = canvas.getContext('webgl2');
  // shaders and program
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, pixelsVertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = createProgram(gl, vertexShader, fragmentShader);
  // attribute and buffer
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
  const colorUniformLocation = gl.getUniformLocation(program, 'u_color');
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
  /*
  gl.useProgram is like gl.bindBuffer above in that it sets the current program.
  After that all the gl.uniformXXX functions set uniforms on the current program.
   */
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  for (let i = 0; i < 5; i++) {
    const x = randomInt(0, 400);
    const y = randomInt(0, 400);
    const width = randomInt(0, 400);
    const height = randomInt(0, 400);
    setRectangle(gl, x, y, width, height);

    const r = Math.random();
    const g = Math.random();
    const b = Math.random();
    gl.uniform4f(colorUniformLocation, r, g, b, 1);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

}());
