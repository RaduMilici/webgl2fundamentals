import { Matrix4 } from 'pulsar-pathfinding';
import getRotationValues from '../../utils/getRotationValues';
// prettier-ignore
export default class ZRotationMatrix extends Matrix4 {
  constructor(radians) {
    const { sin, cos } = getRotationValues(radians);
    super(
       cos, sin, 0, 0, 
      -sin, cos, 0, 0, 
         0,   0, 1, 0, 
         0,   0, 0, 1);
  }
}
