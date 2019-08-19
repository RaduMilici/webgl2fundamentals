import { uniqueId, Matrix3 } from 'pulsar-pathfinding';

export default class Mesh {
  constructor({ context, geometry, material }) {
    this.id = uniqueId();
    this._context = context;
    this._geometry = geometry;
    this._material = material;
    this._geometryBuffer = this._context.createBuffer();
    this._position = null;
    this._rotation = null;
    this._scale = null;
    this._matrices = {
      position: null,
      rotation: null,
      scale: null,
    };
    this._init();
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
    this._position = [x, y];
    this._matrices.position = new Matrix3(1, 0, 0, 0, 1, 0, x, y, 1);
  }

  set rotation(radians) {
    const sin = Math.sin(radians);
    const cos = Math.cos(radians);
    this._rotation = [sin, cos];
    this._matrices.rotation = new Matrix3(cos, -sin, 0, sin, cos, 0, 0, 0, 1);
  }

  set scale({ x, y }) {
    this._scale = [x, y];
    this._matrices.scale = new Matrix3(x, 0, 0, 0, y, 0, 0, 0, 1);
  }

  _init() {
    this.position = { x: 0, y: 0 };
    this.rotation = 0;
    this.scale = { x: 1, y: 1 };
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
    this._updateTranslation();
    this._context.drawArrays(this._context.TRIANGLES, 0, this._geometry.vertices.length);
    this._context.useProgram(null);
  }

  _updateTranslation() {
    const { elements } = this._matrices.position
      .multiply(this._matrices.rotation)
      .multiply(this._matrices.scale);
    this._context.uniformMatrix3fv(this._material._uniforms.uMatrixLoc, false, elements);
  }
}
