import Gl from './gl';
import { vertexShaderSource, fragmentShaderSource } from './shadersSources';
import createShader from './shader';

const gl = new Gl({ canvasSelector: '#webGl' });
gl.setSize({ width: 500, height: 500 });
gl.clear();

console.log(gl);
