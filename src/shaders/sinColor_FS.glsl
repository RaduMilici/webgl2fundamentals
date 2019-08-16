#version 300 es
precision mediump float;

out vec4 color;
in vec3 fragColor;

void main() {
  vec2 xy = sin(gl_FragCoord.xy * 0.05);
  float g = fract(xy.x * xy.y);
  color = vec4(0., g, 0., 1.);
}