import glsl from 'rollup-plugin-glsl';

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
  ],
};
