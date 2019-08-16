import { Triangle, Vector, randomFloat } from 'pulsar-pathfinding';

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

export default randomTris;
