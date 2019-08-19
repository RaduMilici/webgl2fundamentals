import { Matrix4 } from 'pulsar-pathfinding';
// prettier-ignore
export default class PositionMatrix extends Matrix4 {
  constructor({ x, y, z }) {
    super(
      1, 0, 0, 0, 
      0, 1, 0, 0, 
      0, 0, 1, 0, 
      x, y, z, 1
    );
  }
}
