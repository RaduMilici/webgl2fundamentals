#version 300 es

in vec2 a_position;
in vec3 a_vertColor;

uniform vec2 u_resolution;
uniform float u_pointSize;

out vec3 fragColor;

vec2 get2dPosition() {
  vec2 zeroToOne = a_position / u_resolution;
  return zeroToOne;
}

void main() {
  fragColor = a_vertColor;
  gl_PointSize = u_pointSize;
  gl_Position = vec4(a_position, 0., 1.);
}