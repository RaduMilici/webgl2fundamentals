#version 300 es

in vec2 a_position;
in vec3 a_vertColor;

uniform float u_pointSize;
uniform mat3 u_matrix;

out vec3 fragColor;

void main() {
  fragColor = a_vertColor;  
  gl_PointSize = u_pointSize;
  gl_Position = vec4(u_matrix * vec3(a_position, 1.), 1.);
}