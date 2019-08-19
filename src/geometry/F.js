import Triangle from '../geometry/Triangle';
import Geometry from '../geometry/Geometry';
import Vector3 from './Vector3';

const coords = [
  // left column
  0,
  0,
  0,
  30,
  0,
  0,
  0,
  150,
  0,
  0,
  150,
  0,
  30,
  0,
  0,
  30,
  150,
  0,

  // top rung
  30,
  0,
  0,
  100,
  0,
  0,
  30,
  30,
  0,
  30,
  30,
  0,
  100,
  0,
  0,
  100,
  30,
  0,

  // middle rung
  30,
  60,
  0,
  67,
  60,
  0,
  30,
  90,
  0,
  30,
  90,
  0,
  67,
  60,
  0,
  67,
  90,
  0,
];

const triangles = [];

for (let i = 0; i < coords.length; i += 9) {
  const a = new Vector3({ x: coords[i], y: coords[i + 1], z: coords[i + 2] });
  const b = new Vector3({ x: coords[i + 3], y: coords[i + 4], z: coords[i + 5] });
  const c = new Vector3({ x: coords[i + 6], y: coords[i + 7], z: coords[i + 8] });
  triangles.push(new Triangle(a, b, c));
}

export default new Geometry(triangles);
