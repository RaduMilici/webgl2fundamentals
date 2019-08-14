import './ui/index';
import Gl from './gl';
import vertexColorsFS_Source from './shaders/vertexColors_FS.glsl';
import sinColorsFS_Source from './shaders/sinColor_FS.glsl';
import vsSource from './shaders/vertexShader.glsl';
import Mesh from './Mesh';
import Scene from './Scene';
import randomTris from './utils/random-tris';

const gl = new Gl({ canvasSelector: '#webGl' });
const { context } = gl;
const [width, height] = [500, 500];

gl.setSize({ width, height });
gl.setClearColor({ r: 0, g: 0, b: 0, a: 1 });

const meshVertexColors = new Mesh({
  context,
  geometry: new Float32Array(randomTris(3)),
  vertexShaderSrc: vsSource,
  fragmentShaderSrc: vertexColorsFS_Source,
});

const meshSinColors = new Mesh({
  context,
  geometry: new Float32Array(randomTris(3)),
  vertexShaderSrc: vsSource,
  fragmentShaderSrc: sinColorsFS_Source,
});

const scene = new Scene();
const scene2 = new Scene();
scene.add(meshVertexColors);
scene2.add(meshSinColors);

setInterval(() => {
  if (scene2.contains(meshSinColors)) {
    scene2.remove(meshSinColors);
  } else {
    scene2.add(meshSinColors);
  }
}, 1000);

const drawScene = () => {
  gl.clear();
  gl.render(scene);
  gl.render(scene2);
  context.useProgram(null);
  requestAnimationFrame(drawScene);
};

drawScene();
