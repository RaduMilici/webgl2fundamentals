import { VertexShader, FragmentShader } from './shader/index';
import Program from './Program';

export default class Mesh {
  constructor({ context, geometry, vertexShaderSrc, fragmentShaderSrc }) {
    this._context = context;
    this._geometry = geometry;
    this._vertexShaderSrc = vertexShaderSrc;
    this._fragmentShaderSrc = fragmentShaderSrc;

    const { vertexShader, fragmentShader } = this._compileShders({
      context: this._context,
      vertexShaderSrc: this._vertexShaderSrc,
      fragmentShaderSrc: this._fragmentShaderSrc,
    });

    this._vertexShader = vertexShader;
    this._fragmentShader = fragmentShader;
    this._program = new Program({
      context: this._context,
      vertexShader: this._vertexShader,
      fragmentShader: this._fragmentShader,
      debug: true,
    });

    this._attributes = this._getAttributes();
  }

  _compileShders({ context, vertexShaderSrc, fragmentShaderSrc }) {
    const vertexShader = new VertexShader({ context, source: vertexShaderSrc });
    const fragmentShader = new FragmentShader({ context, source: fragmentShaderSrc });
    return { vertexShader, fragmentShader };
  }

  _getAttributes() {
    const aPositionLoc = this._getAttribLocation('a_position');
    const aVertColorLoc = this._getAttribLocation('a_vertColor');

    return { aPositionLoc, aVertColorLoc };
  }

  _getAttribLocation(name) {
    return this._context.getAttribLocation(this._program.gl_program, name);
  }
}
