import { uniqueId } from 'pulsar-pathfinding';
import {
  PositionMatrix,
  ScaleMatrix,
  XRotationMatrix,
  YRotationMatrix,
  ZRotationMatrix,
} from './matrices';

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
      rotation: {
        x: null,
        y: null,
        z: null,
      },
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
      z: this._scale[2],
    };
  }

  set position({ x, y, z }) {
    this._position = [x, y, z];
    this._matrices.position = new PositionMatrix({ x, y, z });
  }

  set rotation({ x, y, z }) {
    this._rotation = [x, y, z];
    this.rotationX = x;
    this.rotationY = y;
    this.rotationZ = z;
  }

  set rotationX(radians) {
    this._matrices.rotation.x = new XRotationMatrix(radians);
  }

  set rotationY(radians) {    
    this._matrices.rotation.y = new YRotationMatrix(radians);
  }

  set rotationZ(radians) {
    this._matrices.rotation.z = new ZRotationMatrix(radians);
  }

  set scale({ x, y, z }) {
    this._scale = [x, y, z];
    this._matrices.scale = new ScaleMatrix({ x, y, z });
  }

  _init() {
    this.position = { x: 0, y: 0, z: 0 };
    this.rotation = { x: 0, y: 0, z: 0 };
    this.scale = { x: 1, y: 1, z: 1 };
  }

  _renderImmediate({ projectionMatrix }) {
    this._context.useProgram(this._material._program.gl_program);
    this._context.bindBuffer(this._context.ARRAY_BUFFER, this._geometryBuffer);
    this._context.bufferData(
      this._context.ARRAY_BUFFER,
      this._geometry._vertexCoords,
      this._context.STATIC_DRAW
    );
    this._material._enableAttribs();
    this._updateTranslation(projectionMatrix);
    this._context.drawArrays(this._context.TRIANGLES, 0, this._geometry.vertices.length);
    this._context.useProgram(null);
  }

  _updateTranslation(projectionMatrix) {
    const translationMatrix = 
      projectionMatrix
        .multiply(this._matrices.position)
        .multiply(this._matrices.rotation.x)
        .multiply(this._matrices.rotation.y)
        .multiply(this._matrices.rotation.z)
        .multiply(this._matrices.scale);
    this._context.uniformMatrix4fv(this._material._uniforms.uMatrixLoc, false, translationMatrix.elements);
  }
}
