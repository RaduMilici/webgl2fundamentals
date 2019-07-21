import Gl from './gl';
import fragmentShaderSource from './shaders/fragmentShader.glsl';
import vertexShaderSource from './shaders/vertexShader.glsl';
import { createShader } from './shader';
import createProgram from './program';
import trianglePoints from './const/trianglePoints';

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

// POINTS
const aPositionLoc = context.getAttribLocation(program, 'a_position');
const uPointSizeLoc = context.getUniformLocation(program, 'uPointSize');
const vertsArray = new Float32Array([0.8, -0.8]);
const vertsBuffer = context.createBuffer();

context.bindBuffer(context.ARRAY_BUFFER, vertsBuffer);
context.bufferData(context.ARRAY_BUFFER, vertsArray, context.STATIC_DRAW);

const size = 2; // 2 components per iteration
const type = context.FLOAT; // the data is 32bit floats
const normalize = context.FALSE; // don't normalize the data
const stride = size * Float32Array.BYTES_PER_ELEMENT; // 0 means iterate size * sizeof(type) to get next index
const offset = 0; // start at the beginning of the buffer
// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
context.vertexAttribPointer(aPositionLoc, size, type, normalize, stride, offset);
context.enableVertexAttribArray(aPositionLoc);
context.bindBuffer(context.ARRAY_BUFFER, null);
context.useProgram(program);
context.uniform1f(uPointSizeLoc, 10);
context.drawArrays(context.POINTS, 0, vertsArray.length / size);

function random(min = 0, max = 1) {
  return Math.random() * (max - min) + min;
}

gl.setClearColor({ r: 0, g: 0, b: 0, a: 1 });

const animate = () => {
  gl.clear();

  const posArray = [];
  const count = 100;

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

// setInterval(animate, 100);

// TRIANGLE
const trangleVertsBuffer = context.createBuffer();
const trangleVertsArray = new Float32Array(trianglePoints);
context.bindBuffer(context.ARRAY_BUFFER, trangleVertsBuffer);
context.bufferData(context.ARRAY_BUFFER, trangleVertsArray, context.STATIC_DRAW);
context.vertexAttribPointer(aPositionLoc, size, type, normalize, stride, offset);
context.drawArrays(context.TRIANGLES, 0, trangleVertsArray.length / 2);

//context.useProgram(null);
context.useProgram(null);
