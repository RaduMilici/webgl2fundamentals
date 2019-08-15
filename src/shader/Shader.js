import { uniqueId } from 'pulsar-pathfinding';

export default class Shader {
  constructor({ context, type, source }) {
    this._id = uniqueId();
    this.context = context;
    this.source = source;
    this.gl_shader = context.createShader(type);
    this.context.shaderSource(this.gl_shader, source);
    this.context.compileShader(this.gl_shader);
    this.verify();
  }

  delete(program) {
    this.context.detachShader(program, this.gl_shader);
    this.context.deleteShader(this.gl_shader);
  }

  verify() {
    const success = this.context.getShaderParameter(this.gl_shader, this.context.COMPILE_STATUS);

    if (!success) {
      const infoLog = this.context.getShaderInfoLog(this.gl_shader);
      this.context.deleteShader(this.gl_shader);
      throw infoLog;
    }
  }
}
