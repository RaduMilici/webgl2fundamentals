import Gl from './gl';
import fragmentShaderSource from './shaders/fragmentShader.glsl';
import vertexShaderSource from './shaders/vertexShader.glsl';
import { createShader } from './shader';
import createProgram from './program';

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
context.useProgram(null);
