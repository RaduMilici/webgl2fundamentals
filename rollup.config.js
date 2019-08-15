import glsl from 'rollup-plugin-glsl';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';

module.exports = {
  input: 'src/index.js',
  output: {
    file: 'bundle.js',
    format: 'iife',
  },
  plugins: [
    resolve(),
    glsl({
      include: 'src/**/*.glsl',
    }),
    json({
      exclude: ['node_modules/**'],
    }),
  ],
};
