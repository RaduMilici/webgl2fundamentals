import { Updater, Component, randomFloat } from 'pulsar-pathfinding';
import Renderer from './Renderer';
import Geometry from './geometry/Geometry';
import Mesh from './Mesh';
import BasicMaterial from './material/BasicMaterial';
import Scene from './Scene';
import { randomTris3D } from './utils/random-tris';
import Color from './Color';
import fGeometry from './geometry/F';

class RotatingMesh extends Mesh {
  update({ elapsedTime }) {
    this.rotation = { x: 0, y: elapsedTime * 0.5, z: 0 };
  }
}

class Draw extends Component {
  constructor() {
    super();

    this.renderer = new Renderer({
      canvasSelector: '#webGl',
      clearColor: { r: 0, g: 0, b: 0, a: 1 },
      size: { width: 500, height: 500, depth: 100 },
    });

    const basicMaterial1 = new BasicMaterial({
      context: this.renderer.context,
    });
    basicMaterial1.color = new Color({ r: 0, g: 0, b: 1 });

    const basicMaterial2 = new BasicMaterial({
      context: this.renderer.context,
    });
    basicMaterial2.color = new Color({ r: 0, g: 1, b: 0 });

    this.mesh1 = new RotatingMesh({
      context: this.renderer.context,
      geometry: new Geometry(randomTris3D(3, { width: 500, height: 500, depth: 100 })),
      material: basicMaterial1,
    });

    this.mesh2 = new RotatingMesh({
      context: this.renderer.context,
      geometry: fGeometry,
      material: basicMaterial2,
    });
    this.mesh2.position = { x: 1, y: -1, z: 0 };

    this.scene = new Scene();
    this.scene.add(this.mesh1, this.mesh2);
  }

  update(timeData) {
    this.mesh1.update(timeData);
    this.mesh2.update(timeData);
    this.renderer.render(this.scene);
  }
}

const updater = new Updater();
const draw = new Draw();

updater.add(draw);

try {
  updater.start();
} catch (e) {
  console.error(e);
  updater.stop();
}
