export default class Geometry {
  constructor(triangles) {
    this._triangles = triangles;
    this.vertices = this._getVertices();
    this._vertexCoords = this._getVertexCoords();
  }

  _getVertices() {
    return this._triangles.reduce((acc, triangle) => {
      acc.push(...triangle.points);
      return acc;
    }, []);
  }

  _getVertexCoords() {
    const coords = this.vertices.reduce((acc, { x, y }) => {
      acc.push(x, y);
      return acc;
    }, []);

    return new Float32Array(coords);
  }
}
