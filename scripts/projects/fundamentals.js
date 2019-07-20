const build = require('../build');

const inputOptions = {
  input: './fundamentals/src/index.js'
};

const outputOptions = {
  dir: './fundamentals/bundle',
  format: 'iife',
  file: 'bundle.js'
};

build({ inputOptions, outputOptions });
