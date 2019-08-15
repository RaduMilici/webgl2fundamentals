import { Vector } from 'pulsar-pathfinding';
import './ui/index';
import Renderer from './Renderer';
import vertexColorsFS_Source from './shaders/vertexColors_FS.glsl';
import sinColorsFS_Source from './shaders/sinColor_FS.glsl';
import vsSource from './shaders/vertexShader.glsl';
import Mesh from './Mesh';
import Scene from './Scene';
import randomTris from './utils/random-tris';

console.log(Vector);

const renderer = new Renderer({
  canvasSelector: '#webGl',
  clearColor: { r: 0, g: 0, b: 0, a: 1 },
  size: { width: 500, height: 500 },
});

const { context } = renderer;

const vertexColors = new Mesh({
  context,
  geometry: new Float32Array(randomTris(3)),
  vertexShaderSrc: vsSource,
  fragmentShaderSrc: vertexColorsFS_Source,
});

const sinColors = new Mesh({
  context,
  geometry: new Float32Array(randomTris(3)),
  vertexShaderSrc: vsSource,
  fragmentShaderSrc: sinColorsFS_Source,
});

const scene = new Scene();
const scene2 = new Scene();
scene.add(vertexColors);
scene2.add(sinColors);

const drawScene = () => {
  renderer.render(scene, scene2);
  requestAnimationFrame(drawScene);
};

drawScene();
