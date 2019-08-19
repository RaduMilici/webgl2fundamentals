import { Triangle, Vector, randomInt } from 'pulsar-pathfinding';
import Triangle3D from '../geometry/Triangle';
import Vector3 from '../geometry/Vector3';

const randomTris3D = (num, { width, height }) => {
  const tris = [];

  for (let i = 0; i < num; i++) {
    const a = new Vector3({ x: randomInt(0, width), y: randomInt(0, height), z: 10 });
    const b = new Vector3({ x: randomInt(0, width), y: randomInt(0, height), z: 10 });
    const c = new Vector3({ x: randomInt(0, width), y: randomInt(0, height), z: 10 });
    const triangle = new Triangle3D(a, b, c);
    tris.push(triangle);
  }

  return tris;
};

const randomTris = num => {
  const tris = [];

  for (let i = 0; i < num; i++) {
    const a = new Vector({ x: randomFloat(-1, 1), y: randomFloat(-1, 1) });
    const b = new Vector({ x: randomFloat(-1, 1), y: randomFloat(-1, 1) });
    const c = new Vector({ x: randomFloat(-1, 1), y: randomFloat(-1, 1) });
    const triangle = new Triangle(a, b, c);
    tris.push(triangle);
  }

  return tris;
};

export { randomTris, randomTris3D };
