const Vector2 = require('./Vector2');
var fs = require('fs');
const Color = require('./Color');
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

const json = JSON.stringify(randomTris(1000));

fs.writeFileSync('myjsonfile.json', json);
