import glsl from 'rollup-plugin-glsl';
import json from 'rollup-plugin-json';

module.exports = {
  input: 'src/index.js',
  output: {
    file: 'bundle.js',
    format: 'iife',
  },
  plugins: [
    glsl({
      include: 'src/**/*.glsl',
    }),
    json({
      exclude: ['node_modules/**'],
    }),
  ],
};
