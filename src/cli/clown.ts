#!/usr/bin/env node
import program from 'commander';

import { extendConfig } from './extendConfig';
import { checkExtendedConfig } from './checkExtendedConfig';

const cwd = process.cwd();

async function handleExtendConfig() {
  return extendConfig(cwd);
}

program.command('run').action(handleExtendConfig);

program.command('check').action(async () => {
  return checkExtendedConfig(cwd);
});

program.parse(process.argv);

if (program.args.length < 1) {
  handleExtendConfig();
}
