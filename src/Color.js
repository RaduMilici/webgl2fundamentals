export default class Color {
  constructor({ r, g, b }) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  get values() {
    return [this.r, this.g, this.b];
  }
}
