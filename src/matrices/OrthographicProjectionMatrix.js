import { Matrix4 } from 'pulsar-pathfinding';
export default class OrthographicProjectionMatrix extends Matrix4 {
  constructor({ left, right, bottom, top, near, far }) {
    super(
      2 / (right - left),
      0,
      0,
      0,
      0,
      2 / (top - bottom),
      0,
      0,
      0,
      0,
      2 / (near - far),
      0,
      (left + right) / (left - right),
      (bottom + top) / (bottom - top),
      (near + far) / (near - far),
      1
    );
  }
}
