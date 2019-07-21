#version 300 es
in vec2 a_position;
in vec3 a_vertColor;

uniform float uPointSize;

out vec3 fragColor;

void main() {
  fragColor = a_vertColor;
  gl_PointSize = uPointSize;
  gl_Position = vec4(a_position, 0., 1.);
}