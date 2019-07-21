const vertexShaderSource = `#version 300 es
in vec3 a_position;
uniform float uPointSize;

void main() {
  gl_PointSize = uPointSize;
  gl_Position = vec4(a_position, 1.0);
}`;

const fragmentShaderSource = `#version 300 es
precision mediump float;
out vec4 color;

void main() {
  color = vec4(0, 0, 1, 1);
}
`;

export { vertexShaderSource, fragmentShaderSource };
