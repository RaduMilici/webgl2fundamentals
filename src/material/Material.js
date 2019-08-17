import { uniqueId } from 'pulsar-pathfinding';
import { VertexShader, FragmentShader } from '../shader/index';
import Program from '../Program';

export default class Material {
  constructor({ context, vertexShaderSrc, fragmentShaderSrc }) {
    this.id = uniqueId();
    this._context = context;

    const { vertexShader, fragmentShader } = this._compileShders({
      context: this._context,
      vertexShaderSrc,
      fragmentShaderSrc,
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
    this._uniforms = this._getUniforms();
  }

  _compileShders({ context, vertexShaderSrc, fragmentShaderSrc }) {
    const vertexShader = new VertexShader({ context, source: vertexShaderSrc });
    const fragmentShader = new FragmentShader({ context, source: fragmentShaderSrc });
    return { vertexShader, fragmentShader };
  }

  _enableAttribs() {
    this._context.enableVertexAttribArray(this._attributes.aPositionLoc);

    this._context.vertexAttribPointer(
      this._attributes.aPositionLoc,
      2,
      this._context.FLOAT,
      this._context.FALSE,
      0,
      0
    );
  }

  _getAttributes() {
    const aPositionLoc = this._getAttribLocation('a_position');
    return { aPositionLoc };
  }

  _getUniforms() {
    const uTranslationLoc = this._getUniformLocation('u_translation');
    const uScaleLoc = this._getUniformLocation('u_scale');
    const uRotationLoc = this._getUniformLocation('u_rotation');

    return { uTranslationLoc, uScaleLoc, uRotationLoc };
  }

  _getAttribLocation(name) {
    return this._context.getAttribLocation(this._program.gl_program, name);
  }

  _getUniformLocation(name) {
    return this._context.getUniformLocation(this._program.gl_program, name);
  }
}
