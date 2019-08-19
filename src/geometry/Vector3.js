import { Vector } from 'pulsar-pathfinding';

export default class Vector3 extends Vector {
  constructor({ x = 0, y = 0, z = 0 }) {
    super({ x, y });
    this.z = z;
  }
}
