#version 300 es
precision mediump float;

out vec4 color;
in vec3 fragColor;

void main() {
  vec3 sinColor = vec3(0., sin(gl_FragCoord.x * 0.5), 0.);
  color = vec4(sinColor, 1.);
}