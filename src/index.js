import { Updater, Component } from 'pulsar-pathfinding';
import Renderer from './Renderer';
import Geometry from './Geometry';
import fsSource from './shaders/sinColor_FS.glsl';
import vsSource from './shaders/vertexShader.glsl';
import Mesh from './Mesh';
import Material from './Material';
import Scene from './Scene';
import randomTris from './utils/random-tris';

class RotatingMesh extends Mesh {
  constructor(data) {
    super(data);
  }

  update({ elapsedTime }) {
    this.rotation = elapsedTime * 0.5;
  }
}

class Draw extends Component {
  constructor() {
    super();

    this.renderer = new Renderer({
      canvasSelector: '#webGl',
      clearColor: { r: 0, g: 0, b: 0, a: 1 },
      size: { width: 500, height: 500 },
    });

    const material = new Material({
      context: this.renderer.context,
      vertexShaderSrc: vsSource,
      fragmentShaderSrc: fsSource,
    });

    this.mesh = new RotatingMesh({
      context: this.renderer.context,
      geometry: new Geometry(randomTris(10)),
      material,
    });

    this.scene = new Scene();
    this.scene.add(this.mesh);
  }

  update(timeData) {
    this.mesh.update(timeData);
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
