import { Vector, randomFloat } from 'pulsar-pathfinding';
import Color from '../Color';

const randomColor = () =>
  new Color({
    r: randomFloat(0, 1),
    g: randomFloat(0, 1),
    b: randomFloat(0, 1),
  });

const randomTri = () => {
  const a = new Vector({ x: randomFloat(-1, 1), y: randomFloat(-1, 1) });
  const b = new Vector({ x: randomFloat(-1, 1), y: randomFloat(-1, 1) });
  const c = new Vector({ x: randomFloat(-1, 1), y: randomFloat(-1, 1) });

  return [
    a.x,
    a.y,
    ...randomColor().values,
    b.x,
    b.y,
    ...randomColor().values,
    c.x,
    c.y,
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

export default randomTris;
