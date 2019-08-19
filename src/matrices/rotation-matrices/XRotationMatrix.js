import { Matrix4 } from 'pulsar-pathfinding';
import getRotationValues from '../../utils/getRotationValues';
// prettier-ignore
export default class XRotationMatrix extends Matrix4 {
  constructor(radians) {
    const { sin, cos } = getRotationValues(radians);
    super(
      1,   0,    0, 0, 
      0, cos,  sin, 0,
      0, -sin, cos, 0,
      0,    0,   0, 1
    );
  }
}
