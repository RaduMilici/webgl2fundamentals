import { Updater, Component, Vector } from 'pulsar-pathfinding';
import Renderer from './Renderer';
import Geometry from './Geometry';
import fsSource from './shaders/sinColor_FS.glsl';
import vsSource from './shaders/vertexShader.glsl';
import Mesh from './Mesh';
import Material from './material/Material';
import BasicMaterial from './material/BasicMaterial';
import Scene from './Scene';
import randomTris from './utils/random-tris';
import Color from './Color';

class RotatingMesh extends Mesh {
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

    const basicMaterial = new BasicMaterial({
      context: this.renderer.context,
    });
    basicMaterial.color = new Color({ r: 0, g: 0, b: 1 });

    this.mesh = new RotatingMesh({
      context: this.renderer.context,
      geometry: new Geometry(randomTris(3)),
      material,
    });

    this.basicMesh = new RotatingMesh({
      context: this.renderer.context,
      geometry: new Geometry(randomTris(3)),
      material: basicMaterial,
    });

    this.scene = new Scene();
    this.scene.add(this.mesh, this.basicMesh);
  }

  update(timeData) {
    this.mesh.update(timeData);
    this.basicMesh.update(timeData);
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
