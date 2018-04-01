#!/usr/bin/env node
import program from 'commander';

// import { extendConfig } from './extendConfig';
import { checkExtendedConfig } from './checkExtendedConfig';

const cwd = process.cwd();

// function handleExtendConfig() {
//   return extendConfig(cwd);
// }

// program.command('run').action(handleExtendConfig);

program.command('check').action(() => {
  return checkExtendedConfig(cwd);
});

program.parse(process.argv);

// if (program.args.length < 1) {
//   console.log('=\nFILE: clown.ts\nLINE: 22\n=');
//   handleExtendConfig();
// }
