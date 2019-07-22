import Gl from './gl';
import fsSource from './shaders/fragmentShader.glsl';
import vsSource from './shaders/vertexShader.glsl';
import { VertexShader, FragmentShader } from './shader/index';
import Program from './Program';
import trianglePoints from './const/trianglePoints';

const gl = new Gl({ canvasSelector: '#webGl' });
const { context } = gl;
gl.setSize({ width: 500, height: 500 });
gl.setClearColor({ r: 0, g: 0, b: 0, a: 1 });
gl.clear();

const vertexShader = new VertexShader({ context, source: vsSource });
const fragmentShader = new FragmentShader({ context, source: fsSource });
const program = new Program({ context, vertexShader, fragmentShader, debug: true });

const aPositionLoc = context.getAttribLocation(program.gl_program, 'a_position');
const aVertColorLoc = context.getAttribLocation(program.gl_program, 'a_vertColor');
const uPointSizeLoc = context.getUniformLocation(program.gl_program, 'uPointSize');
const vertsBuffer = context.createBuffer();

context.bindBuffer(context.ARRAY_BUFFER, vertsBuffer);
context.bufferData(context.ARRAY_BUFFER, trianglePoints, context.STATIC_DRAW);
context.useProgram(program.gl_program);
context.uniform1f(uPointSizeLoc, 30);

const size = 2; // components per iteration
const colorSize = 3;
const type = context.FLOAT; // the data is 32bit floats
const normalize = context.FALSE; // don't normalize the data
const stride = 5 * Float32Array.BYTES_PER_ELEMENT; // 0 means iterate size * sizeof(type) to get next index
const offset = 0; // start at the beginning of the buffer
const colorOffset = 2 * Float32Array.BYTES_PER_ELEMENT;
// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
context.vertexAttribPointer(aPositionLoc, size, type, normalize, stride, offset);
context.vertexAttribPointer(aVertColorLoc, colorSize, type, normalize, stride, colorOffset);
context.enableVertexAttribArray(aVertColorLoc);
context.enableVertexAttribArray(aPositionLoc);

context.drawArrays(context.TRIANGLES, 0, 3);
context.drawArrays(context.POINTS, 0, 3);
context.bindBuffer(context.ARRAY_BUFFER, null);
