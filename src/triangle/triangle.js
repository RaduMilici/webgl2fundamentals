import { vertexShaderSource, fragmentShaderSource } from './shadersSources';
import { createShader } from '../shader';
import { createProgram } from '../program';
import resize from './resize';
import trianglePoints from '../const/trianglePoints';

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
gl.bufferData(gl.ARRAY_BUFFER, trianglePoints, gl.STATIC_DRAW);
// vao
const vao = gl.createVertexArray();
gl.bindVertexArray(vao);
gl.enableVertexAttribArray(positionAttributeLocation);
/*
A hidden part of gl.vertexAttribPointer is that it binds the current ARRAY_BUFFER to the attribute.
In other words now this attribute is bound to positionBuffer. That means we're free to bind something
else to the ARRAY_BUFFER bind point. The attribute will continue to use positionBuffer.
 */
const size = 2; // 2 components per iteration (2d points)
const type = gl.FLOAT; // the data is 32bit floats
const normalize = false; // don't normalize the data
const stride = 0; // 0 means iterate size * sizeof(type) to get next index
const offset = 0; // start at the beginning of the buffer
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
// viewport
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES, 0, 3);
