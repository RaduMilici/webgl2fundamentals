import { Matrix4 } from 'pulsar-pathfinding';
// prettier-ignore
export default class ScaleMatrix extends Matrix4 {
  constructor({ x, y, z }) {
    super(
      x, 0, 0, 0, 
      0, y, 0, 0, 
      0, 0, z, 0, 
      0, 0, 0, 1);
  }
}
