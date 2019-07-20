const vertexShaderSource = `#version 300 es
in vec4 a_position;
uniform float uPointSize;

void main() {
  gl_PointSize = uPointSize;
  gl_Position = a_position;
}`;

const fragmentShaderSource = `#version 300 es
precision mediump float;
out vec4 color;

void main() {
  color = vec4(0, 1, 0, 1);
}
`;

export { vertexShaderSource, fragmentShaderSource };
