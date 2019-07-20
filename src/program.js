const createProgram = (gl, vertexShader, fragmentShader) => {
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (!success) {
    const infoLog = gl.getProgramInfoLog(program);
    console.error(infoLog);
    gl.deleteProgram(program);
    return null;
  }

  return program;
};

export  { createProgram };