const vertexShaderSource = `#version 300 es
in vec4 a_position;

void main() {
  gl_Position = a_position;
}`;

const pixelsVertexShaderSource = `#version 300 es
in vec2 a_position;
uniform vec2 u_resolution;

void main() {
  vec2 zeroToOne = a_position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  
  gl_Position = vec4(clipSpace, 0, 1);
}
`;

const fragmentShaderSource = `#version 300 es
precision mediump float;
uniform vec4 u_color;
out vec4 outColor;

void main() {
  float amp = 5.0; 
  float sinColor = (sin(gl_FragCoord.x) * sin(gl_FragCoord.y)) * amp;
  outColor = u_color + sinColor;
}
`;

export { vertexShaderSource, pixelsVertexShaderSource, fragmentShaderSource };
