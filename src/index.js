import { Updater, Component, Triangle, randomFloat, Vector } from 'pulsar-pathfinding';
import Renderer from './Renderer';
import Geometry from './Geometry';
import sinColorsFS_Source from './shaders/sinColor_FS.glsl';
import vsSource from './shaders/vertexShader.glsl';
import Mesh from './Mesh';
import Scene from './Scene';
import randomTris from './utils/random-tris';

class Draw extends Component {
  constructor() {
    super();

    this.renderer = new Renderer({
      canvasSelector: '#webGl',
      clearColor: { r: 0, g: 0, b: 0, a: 1 },
      size: { width: 500, height: 500 },
    });

    const mesh = new Mesh({
      context: this.renderer.context,
      geometry: new Geometry(randomTris(2)),
      vertexShaderSrc: vsSource,
      fragmentShaderSrc: sinColorsFS_Source,
    });

    this.scene = new Scene();
    this.scene.add(mesh);
  }

  update() {
    this.renderer.render(this.scene);
  }
}

const updater = new Updater();
const draw = new Draw();

updater.add(draw);
updater.start();
