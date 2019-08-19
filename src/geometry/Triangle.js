export default class Triangle3D {
  constructor(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
  }

  get points() {
    return [this.a, this.b, this.c];
  }
}
