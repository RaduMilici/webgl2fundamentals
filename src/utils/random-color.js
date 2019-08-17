import { randomFloat } from 'pulsar-pathfinding';
import Color from '../Color';

const randomColor = () => {
  const r = randomFloat(0, 1);
  const g = randomFloat(0, 1);
  const b = randomFloat(0, 1);

  return new Color({ r, g, b });
};

export default randomColor;
