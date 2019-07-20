import Gl from './gl';

const gl = new Gl({ canvasSelector: '#webGl' });
gl.setSize(500, 500);
gl.clear();

console.log(gl);

