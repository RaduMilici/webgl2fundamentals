import { VertexShader, FragmentShader } from './shader/index';
import Program from './Program';

export default class Mesh {
  constructor({ context, geometry, vertexShaderSrc, fragmentShaderSrc }) {
    this._context = context;
    this._geometry = geometry;
    this._geometryBuffer = this._context.createBuffer();
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
    this._uniforms = this._getUniforms();
  }

  render() {
    this._context.useProgram(this._program.gl_program);
    this._context.bindBuffer(this._context.ARRAY_BUFFER, this._geometryBuffer);
    this._context.bufferData(this._context.ARRAY_BUFFER, this._geometry, this._context.STATIC_DRAW);
    this._enableAttribs();
    this._setValues();
    this._context.useProgram(this._program.gl_program);
  }

  _setValues() {
    this._context.uniform2fv(this._uniforms.uTranslationLoc, new Float32Array([0, 0]));
    this._context.uniform2fv(this._uniforms.uScaleLoc, new Float32Array([1, 1]));
    this._context.uniform2fv(this._uniforms.uRotationLoc, new Float32Array([0, 1]));
    this._context.uniform1f(this._uniforms.uPointSizeLoc, 10);
  }

  _enableAttribs() {
    this._context.enableVertexAttribArray(this._attributes.aPositionLoc);
    this._context.enableVertexAttribArray(this._attributes.aVertColorLoc);

    this._context.vertexAttribPointer(
      this._attributes.aPositionLoc,
      2,
      this._context.FLOAT,
      this._context.FALSE,
      5 * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    this._context.vertexAttribPointer(
      this._attributes.aVertColorLoc,
      3,
      this._context.FLOAT,
      this._context.FALSE,
      0,
      2 * Float32Array.BYTES_PER_ELEMENT
    );
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

  _getUniforms() {
    const uPointSizeLoc = this._getUniformLocation('u_pointSize');
    const uTranslationLoc = this._getUniformLocation('u_translation');
    const uScaleLoc = this._getUniformLocation('u_scale');
    const uRotationLoc = this._getUniformLocation('u_rotation');

    return { uPointSizeLoc, uTranslationLoc, uScaleLoc, uRotationLoc };
  }

  _getAttribLocation(name) {
    return this._context.getAttribLocation(this._program.gl_program, name);
  }

  _getUniformLocation(name) {
    return this._context.getUniformLocation(this._program.gl_program, name);
  }
}
