import { Updater, Component } from 'pulsar-pathfinding';
import './ui/index';
import Renderer from './Renderer';
import vertexColorsFS_Source from './shaders/vertexColors_FS.glsl';
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

    const vertexColors = new Mesh({
      context: this.renderer.context,
      geometry: new Float32Array(randomTris(3)),
      vertexShaderSrc: vsSource,
      fragmentShaderSrc: vertexColorsFS_Source,
    });

    const sinColors = new Mesh({
      context: this.renderer.context,
      geometry: new Float32Array(randomTris(3)),
      vertexShaderSrc: vsSource,
      fragmentShaderSrc: sinColorsFS_Source,
    });

    this.scene = new Scene();
    this.scene2 = new Scene();
    this.scene.add(vertexColors);
    this.scene2.add(sinColors);
  }

  update() {
    this.renderer.render(this.scene, this.scene2);
  }
}

const updater = new Updater();
const draw = new Draw();
updater.add(draw);
updater.start();
