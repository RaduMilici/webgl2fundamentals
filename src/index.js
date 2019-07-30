import './ui/index';
import Gl from './gl';
import fsSource from './shaders/fragmentShader.glsl';
import vsSource from './shaders/vertexShader.glsl';
import { VertexShader, FragmentShader } from './shader/index';
import Program from './Program';
import trianglePoints from './const/trianglePoints';

const gl = new Gl({ canvasSelector: '#webGl' });
const { context } = gl;
const [width, height] = [500, 500];

gl.setSize({ width, height });
gl.setClearColor({ r: 0, g: 0, b: 0, a: 1 });
gl.clear();

const vertexShader = new VertexShader({ context, source: vsSource });
const fragmentShader = new FragmentShader({ context, source: fsSource });
const program = new Program({ context, vertexShader, fragmentShader, debug: true });

const aPositionLoc = context.getAttribLocation(program.gl_program, 'a_position');
const aVertColorLoc = context.getAttribLocation(program.gl_program, 'a_vertColor');
const uResolutionLoc = context.getUniformLocation(program.gl_program, 'u_resolution');
const uPointSizeLoc = context.getUniformLocation(program.gl_program, 'u_pointSize');
const vertsBuffer = context.createBuffer();

context.bindBuffer(context.ARRAY_BUFFER, vertsBuffer);
context.bufferData(context.ARRAY_BUFFER, trianglePoints, context.STATIC_DRAW);
context.useProgram(program.gl_program);
context.uniform1f(uPointSizeLoc, 30);
context.uniform2f(uResolutionLoc, width, height);

const vao = context.createVertexArray();
context.bindVertexArray(vao);

const size = 2; // x, y
const colorSize = 3; // r, g, b
const type = context.FLOAT; // the data is 32bit floats
const normalize = context.FALSE; // don't normalize the data
const stride = 5 * Float32Array.BYTES_PER_ELEMENT; // 0 means iterate size * sizeof(type) to get next index
const offset = 0; // start at the beginning of the buffer
const colorOffset = 2 * Float32Array.BYTES_PER_ELEMENT; // skip positions
context.enableVertexAttribArray(aVertColorLoc);
context.enableVertexAttribArray(aPositionLoc);
context.vertexAttribPointer(aPositionLoc, size, type, normalize, stride, offset);
context.vertexAttribPointer(aVertColorLoc, colorSize, type, normalize, stride, colorOffset);

context.drawArrays(context.TRIANGLES, 0, 3);
context.drawArrays(context.POINTS, 0, 3);
context.bindBuffer(context.ARRAY_BUFFER, null);
