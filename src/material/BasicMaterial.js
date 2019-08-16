import Material from './Material';
import vertexShaderSrc from '../shaders/vertexShader.glsl';
import fragmentShaderSrc from '../shaders/basic/basicFS.glsl';
import Color from '../Color';
import randomColor from '../utils/random-color';

export default class BasicMaterial extends Material {
  constructor({ context }) {
    super({ context, vertexShaderSrc, fragmentShaderSrc });
    this._color = randomColor().values;
    this._setColor();
  }

  get color() {
    const r = this._color[0];
    const g = this._color[1];
    const b = this._color[2];
    return new Color({ r, g, b });
  }

  set color({ r, g, b }) {
    this._color = new Float32Array([r, g, b]);
    this._setColor();
  }

  _setColor() {
    this._context.useProgram(this._program.gl_program);
    this._context.uniform3fv(this._uniforms.uColorLoc, this._color);
    this._context.useProgram(null);
  }

  _getUniforms() {
    return {
      ...super._getUniforms(),
      uColorLoc: this._getUniformLocation('u_color'),
    };
  }
}