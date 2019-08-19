import { Matrix4 } from 'pulsar-pathfinding';

export default class ProjectionMatrix extends Matrix4 {
  constructor({ width, height, depth }) {
    super(2 / width, 0, 0, 0, 0, -2 / height, 0, 0, 0, 0, 2 / depth, 0, -1, 1, 0, 1);
  }
}
