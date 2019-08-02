import './ui/index';
import Gl from './gl';
import vertexColorsFS_Source from './shaders/vertexColors_FS.glsl';
import sinColorsFS_Source from './shaders/sinColor_FS.glsl';
import vsSource from './shaders/vertexShader.glsl';
import Mesh from './Mesh';
import trisJson from './myjsonfile.json';
import randomTris from './utils/random-tris';

const gl = new Gl({ canvasSelector: '#webGl' });
const { context } = gl;
const [width, height] = [500, 500];
gl.setSize({ width, height });
gl.setClearColor({ r: 0, g: 0, b: 0, a: 1 });

const meshes = [];
const tris32 = new Float32Array(trisJson);

const meshVertexColors = new Mesh({
  context,
  geometry: new Float32Array(randomTris(100)),
  vertexShaderSrc: vsSource,
  fragmentShaderSrc: vertexColorsFS_Source,
});

const meshSinColors = new Mesh({
  context,
  geometry: new Float32Array(randomTris(100)),
  vertexShaderSrc: vsSource,
  fragmentShaderSrc: sinColorsFS_Source,
});
meshes.push(meshSinColors, meshVertexColors);

const drawScene = () => {
  gl.clear();
  meshes.forEach(mesh => {
    mesh.render();
    context.drawArrays(context.TRIANGLES, 0, mesh.vertCount);
    context.drawArrays(context.POINTS, 0, mesh.vertCount);
  });
  //context.useProgram(null);
  requestAnimationFrame(drawScene);
};

document.getElementById('x-slider').addEventListener('input', ({ detail }) => {
  meshes[1].position = { x: detail, y: meshes[1].position.y };
});

document.getElementById('y-slider').addEventListener('input', ({ detail }) => {
  meshes[1].position = { x: meshes[1].position.x, y: detail };
});

document.getElementById('rot-slider').addEventListener('input', ({ detail }) => {
  const radians = (360 - detail) * (Math.PI / 180);
  meshes[1].rotation = radians;
});

drawScene();
