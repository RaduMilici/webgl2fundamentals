#version 300 es

in vec2 a_position;
in vec3 a_vertColor;

uniform vec2 u_translation;
uniform vec2 u_rotation;
uniform vec2 u_scale;
uniform float u_pointSize;

out vec3 fragColor;

void main() {
  fragColor = a_vertColor;
  
  float rotatedX = a_position.x * u_rotation.y + a_position.y * u_rotation.x;
  float rotatedY = a_position.y * u_rotation.y - a_position.x * u_rotation.x;

  vec2 rotatedPosition = vec2(rotatedX, rotatedY);
  
  gl_PointSize = u_pointSize;
  gl_Position = vec4(rotatedPosition * u_scale + u_translation, 0., 1.);
}