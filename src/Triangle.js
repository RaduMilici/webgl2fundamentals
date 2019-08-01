export default class Triangle {
  constructor({ a, b, c }) {
    this._a = a;
    this._b = b;
    this._c = c;
  }

  get points() {
    return [this._a, this._b, this._c];
  }
}