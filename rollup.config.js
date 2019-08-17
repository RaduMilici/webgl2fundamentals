import glsl from 'rollup-plugin-glsl';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import closure from '@ampproject/rollup-plugin-closure-compiler';

module.exports = {
  input: 'src/index.js',
  output: {
    file: 'bundle.js',
    format: 'iife',
  },
  plugins: [
    closure({
      formatting: 'PRETTY_PRINT',
      module_resolution: 'NODE',
      compilation_level: 'ADVANCED',
    }),
    resolve(),
    glsl({
      include: 'src/**/*.glsl',
    }),
    json({
      exclude: ['node_modules/**'],
    }),
  ],
};
