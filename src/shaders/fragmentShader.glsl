#version 300 es
precision mediump float;
out vec4 color;

in vec3 fragColor;

void main() {
  color = vec4(fragColor, 1.);
}