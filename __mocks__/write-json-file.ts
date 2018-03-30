/* Mostly copied from the source code of `wirte-json-file` and then modified */
import { disk } from '../mockHelpers/Disk';
const path = require('path');
const sortKeys = require('sort-keys');
const pify = require('pify');
const detectIndent = require('detect-indent');

const init = (fn, fp, data, opts) => {
  if (!fp) {
    throw new TypeError('Expected a filepath');
  }

  if (data === undefined) {
    throw new TypeError('Expected data to stringify');
  }

  opts = Object.assign(
    {
      indent: '\t',
      sortKeys: false,
    },
    opts,
  );

  if (opts.sortKeys) {
    data = sortKeys(data, {
      deep: true,
      compare: typeof opts.sortKeys === 'function' && opts.sortKeys,
    });
  }

  return fn(fp, data, opts);
};

const main = (fp, data, opts) => {
  return (opts.detectIndent ? disk.read(fp) : Promise.resolve()).then(str => {
    const indent = str ? detectIndent(str).indent : opts.indent;
    const json = JSON.stringify(data, opts.replacer, indent);

    return disk.write(fp, `${json}\n`);
  });
};

module.exports = (fp, data, opts) => {
  return init(main, fp, data, opts);
};
