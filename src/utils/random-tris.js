import Color from '../Color';
import Vector2 from '../Vector2';

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

export default randomTris;
