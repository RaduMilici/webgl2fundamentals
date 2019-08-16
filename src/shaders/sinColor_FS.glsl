#version 300 es
precision mediump float;

out vec4 color;
in vec3 fragColor;

void main() {
  float x = sin(gl_FragCoord.x * 0.05);
  float y = sin(gl_FragCoord.y * 0.05);
  color = vec4(vec3(0., fract(x * y), 0.), 1.);
}