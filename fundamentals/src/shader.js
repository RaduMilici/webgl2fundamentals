const createShader = (gl, type, source) => {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (!success) {
    const infoLog = gl.getShaderInfoLog(shader);
    console.error(infoLog);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
};

export { createShader };
