import { deleteShader } from './shader';

const validateProgram = ({ context, program }) => {
  context.validateProgram(program);
  const success = context.getProgramParameter(program, context.VALIDATE_STATUS);

  if (!success) {
    const infoLog = context.getProgramInfoLog(program);
    context.deleteProgram(program);
    throw infoLog;
  }
};

const createProgram = ({ context, vertexShader, fragmentShader, validate }) => {
  const program = context.createProgram();

  context.attachShader(program, vertexShader);
  context.attachShader(program, fragmentShader);
  context.linkProgram(program);

  const success = context.getProgramParameter(program, context.LINK_STATUS);

  if (!success) {
    const infoLog = context.getProgramInfoLog(program);
    context.deleteProgram(program);
    throw infoLog;
  }

  if (validate) {
    validateProgram({ context, program });
  }

  deleteShader({ context, program, shader: fragmentShader });
  deleteShader({ context, program, shader: vertexShader });

  return program;
};

export default createProgram;
