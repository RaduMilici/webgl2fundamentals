const deleteShader = ({ gl, program, shader }) => {
  gl.detachShader(program, shader);
  gl.deleteShader(program, shader);
}

const createShader = ({ gl, type, source }) => {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (!success) {
    const infoLog = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw infoLog;
  }

  return shader;
};

export { createShader, deleteShader };
