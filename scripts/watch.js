const rollup = require('rollup');

const watch = ({ watchOptions, callback }) => {
  rollup.watch(watchOptions).on('event', callback);
};

module.exports = watch;