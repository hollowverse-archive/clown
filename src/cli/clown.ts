#!/usr/bin/env node
import program from 'commander';

program
  .command('extend', 'Tells clown to scaffold/extend', { isDefault: true })
  .command(
    'check',
    'Tells clown to verify that your files are compatible with your clown.json',
  )
  .parse(process.argv);
