import Gl from './gl';
import fsSource from './shaders/fragmentShader.glsl';
import vsSource from './shaders/vertexShader.glsl';
import Mesh from './Mesh';
import Vector2 from './Vector2';
import Color from './Color';
import Triangle from './Triangle';

const gl = new Gl({ canvasSelector: '#webGl' });
const { context } = gl;
const [width, height] = [500, 500];

gl.setSize({ width, height });
gl.setClearColor({ r: 0, g: 0, b: 0, a: 1 });
gl.clear();

const randomColor = () =>
  new Color({
    r: random(0, 1),
    g: random(0, 1),
    b: random(0, 1),
  });

const random = (min, max) => Math.random() * (max - min) + min;

const randomTri = () => {
  const a = new Vector2({ x: random(-1, 1), y: random(-1, 1) });
  const b = new Vector2({ x: random(-1, 1), y: random(-1, 1) });
  const c = new Vector2({ x: random(-1, 1), y: random(-1, 1) });

  //const triangle = new Triangle({ a, b, c });

  return [
    ...a.values,
    ...randomColor().values,
    ...b.values,
    ...randomColor().values,
    ...c.values,
    ...randomColor().values,
  ];
};

const randomTris = num => {
  const tris = [];

  for (let i = 0; i < num; i++) {
    tris.push(...randomTri());
  }

  return tris;
};

const meshes = [];

for (let i = 0; i < 1; i++) {
  const mesh = new Mesh({
    context,
    geometry: new Float32Array(randomTris(3)),
    vertexShaderSrc: vsSource,
    fragmentShaderSrc: fsSource,
  });
  meshes.push(mesh);
}

meshes.forEach(mesh => {
  mesh.render();
  context.drawArrays(context.TRIANGLES, 0, mesh.vertCount);
  context.drawArrays(context.POINTS, 0, mesh.vertCount);
});
