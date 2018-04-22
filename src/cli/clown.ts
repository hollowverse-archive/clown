#!/usr/bin/env node
import program from 'commander';

// tslint:disable-next-line:no-var-requires no-require-imports
require('ts-node').register({
  transpileOnly: true,
  'skip-project': true,
});

program
  .command('extend', 'Tells clown to scaffold/extend', { isDefault: true })
  .command(
    'check',
    'Tells clown to verify that your files are compatible with your clown.json',
  )
  .parse(process.argv);
