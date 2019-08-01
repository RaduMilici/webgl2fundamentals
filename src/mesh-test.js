import Gl from './gl';
import fsSource from './shaders/fragmentShader.glsl';
import vsSource from './shaders/vertexShader.glsl';
import trianglePoints from './const/trianglePoints';
import Mesh from './Mesh';

const gl = new Gl({ canvasSelector: '#webGl' });
const { context } = gl;
const [width, height] = [500, 500];

gl.setSize({ width, height });
gl.setClearColor({ r: 0, g: 0, b: 0, a: 1 });
gl.clear();

const shuffle = () => {
  const from = Array.from(trianglePoints);
  const clone = from.slice();
  const shuffled = clone.sort(() => 0.5 - Math.random())
  return new Float32Array(shuffled);
}

const random = (min, max) =>  Math.random() * (max - min) + min;

const randomTri = () => {
  const triangle = [];
  
  for (let i = 0; i < 3; i++) {
    triangle.push(random(-1, 1), random(-1, 1), Math.random(), Math.random(), Math.random());
  }
  
  return new Float32Array(triangle);
}

const meshes = [];

for (let i = 0; i < 100; i++) {
  const mesh = new Mesh({
    context,
    geometry: randomTri(),
    vertexShaderSrc: vsSource,
    fragmentShaderSrc: fsSource,
  });
  meshes.push(mesh);  
}

meshes.forEach(mesh => {
  mesh.render();
  context.drawArrays(context.TRIANGLES, 0, 3);
  context.drawArrays(context.POINTS, 0, 3);
});
