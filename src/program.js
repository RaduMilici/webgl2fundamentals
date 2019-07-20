import { deleteShader } from './shader';

const validateProgram = ({ gl, program }) => {
  gl.validateProgram(program);
  const success = gl.getProgramParameter(program, gl.VALIDATE_STATUS);

  if (!success) {
    const infoLog = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw infoLog;
  }
};

const createProgram = ({ gl, vertexShader, fragmentShader, validate }) => {
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (!success) {
    const infoLog = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw infoLog;
  }

  if (validate) {
    validateProgram({ gl, program });
  }

  deleteShader({ gl, program, shader: fragmentShader });
  deleteShader({ gl, program, shader: vertexShader });

  return program;
};

export default createProgram;
