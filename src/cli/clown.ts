#!/usr/bin/env node
import program from 'commander';

import { extendConfig } from './extendConfig';
import { checkExtendedConfig } from './checkExtendedConfig';

const cwd = process.cwd();

program.command('run').action(() => extendConfig(cwd));
program.command('check').action(() => checkExtendedConfig(cwd));

program.parse(process.argv);
