import { Updater, Component } from 'pulsar-pathfinding';
import Renderer from './Renderer';
import Geometry from './Geometry';
import sinColorsFS_Source from './shaders/sinColor_FS.glsl';
import vsSource from './shaders/vertexShader.glsl';
import Mesh from './Mesh';
import Scene from './Scene';
import randomTris from './utils/random-tris';

class RotatingMesh extends Mesh {
  constructor(data) {
    super(data);
  }

  update({ elapsedTime }) {
    this.rotation = elapsedTime * 0.5;
    //const scale = Math.abs(Math.sin(elapsedTime));
    //this.scale = { x: scale, y: scale };
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

    this.mesh = new RotatingMesh({
      context: this.renderer.context,
      geometry: new Geometry(randomTris(10)),
      vertexShaderSrc: vsSource,
      fragmentShaderSrc: sinColorsFS_Source,
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
updater.start();
