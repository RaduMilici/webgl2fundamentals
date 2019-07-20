const build = require('../build');
const watch = require('../watch');

const inputOptions = {
  input: './fundamentals/src/index.js'
};

const outputOptions = {
  dir: './fundamentals/bundle',
  format: 'iife',
  file: 'bundle.js'
};

const watchOptions = {
  ...inputOptions,
  output: [outputOptions]
};

const callback = () => {
  build({ inputOptions, outputOptions });
};

watch({ watchOptions, callback })

