const deleteShader = ({ context, program, shader }) => {
  context.detachShader(program, shader);
  context.deleteShader(shader);
};

const createShader = ({ context, type, source }) => {
  const shader = context.createShader(type);

  context.shaderSource(shader, source);
  context.compileShader(shader);

  const success = context.getShaderParameter(shader, context.COMPILE_STATUS);

  if (!success) {
    const infoLog = context.getShaderInfoLog(shader);
    context.deleteShader(shader);
    throw infoLog;
  }

  return shader;
};

export { createShader, deleteShader };
