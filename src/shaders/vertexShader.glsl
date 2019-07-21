#version 300 es
in vec2 a_position;
uniform float uPointSize;

void main() {
  gl_PointSize = uPointSize;
  gl_Position = vec4(a_position, 0., 1.);
}