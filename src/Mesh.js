import { uniqueId } from 'pulsar-pathfinding';
import { VertexShader, FragmentShader } from './shader/index';
import Program from './Program';

export default class Mesh {
  constructor({ context, geometry, material }) {
    this.id = uniqueId();
    this._context = context;
    this._geometry = geometry;
    this._material = material;
    this._geometryBuffer = this._context.createBuffer();
    this._position = new Float32Array([0, 0]);
    this._rotation = new Float32Array([0, 1]);
    this._scale = new Float32Array([1, 1]);
  }

  get position() {
    return {
      x: this._position[0],
      y: this._position[1],
    };
  }

  get scale() {
    return {
      x: this._scale[0],
      y: this._scale[1],
    };
  }

  set position({ x, y }) {
    this.position = new Float32Array([x, y]);
  }

  set rotation(radians) {
    this._rotation = new Float32Array([Math.sin(radians), Math.cos(radians)]);
  }

  set scale({ x, y }) {
    this._scale = new Float32Array([x, y]);
  }

  _renderImmediate() {
    this._context.useProgram(this._material._program.gl_program);
    this._context.bindBuffer(this._context.ARRAY_BUFFER, this._geometryBuffer);
    this._context.bufferData(
      this._context.ARRAY_BUFFER,
      this._geometry._vertexCoords,
      this._context.STATIC_DRAW
    );
    this._material._enableAttribs();
    this._setValues();
    this._context.drawArrays(this._context.TRIANGLES, 0, this._geometry.vertices.length);
    this._context.useProgram(null);
  }

  _setValues() {
    this._setScale();
    this._setPosition();
    this._setRotation();
  }

  _setRotation() {
    this._context.uniform2fv(this._material._uniforms.uRotationLoc, this._rotation);
  }

  _setPosition() {
    this._context.uniform2fv(this._material._uniforms.uTranslationLoc, this._position);
  }

  _setScale() {
    this._context.uniform2fv(this._material._uniforms.uScaleLoc, this._scale);
  }
}
