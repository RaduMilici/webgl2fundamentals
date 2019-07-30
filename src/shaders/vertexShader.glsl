#version 300 es

in vec2 a_position;
in vec3 a_vertColor;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_pointSize;

out vec3 fragColor;

void main() {
  fragColor = a_vertColor;
  gl_PointSize = u_pointSize;
  gl_Position = vec4(a_position + u_translation, 0., 1.);
}