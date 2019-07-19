const rollup = require('rollup');

const build = async ({ inputOptions, outputOptions }) => {
  const bundle = await rollup.rollup(inputOptions);
  await bundle.generate(outputOptions);
  await bundle.write(outputOptions);
};

module.exports = build;
