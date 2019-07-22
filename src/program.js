class Program {
  constructor({ context, vertexShader, fragmentShader, debug = false }) {
    this.context = context;
    this.gl_program = context.createProgram();
    this.debug = debug;
    this.attachShaders({ vertexShader, fragmentShader });
    context.linkProgram(this.gl_program);
    this.verify();
    if (this.debug) {
      this.validate();
    }
    vertexShader.delete(this.gl_program);
    fragmentShader.delete(this.gl_program);
  }

  attachShaders({ vertexShader, fragmentShader }) {
    this.context.attachShader(this.gl_program, vertexShader.gl_shader);
    this.context.attachShader(this.gl_program, fragmentShader.gl_shader);
  }

  verify() {
    const success = this.context.getProgramParameter(this.gl_program, this.context.LINK_STATUS);

    if (!success) {
      const infoLog = this.context.getProgramInfoLog(this.gl_program);
      this.context.deleteProgram(this.gl_program);
      throw infoLog;
    }
  }

  validate() {
    this.context.validateProgram(this.gl_program);
    const success = this.context.getProgramParameter(this.gl_program, this.context.VALIDATE_STATUS);

    if (!success) {
      const infoLog = this.context.getProgramInfoLog(this.gl_program);
      this.context.deleteProgram(this.gl_program);
      throw infoLog;
    }
  }
}

export default Program;
