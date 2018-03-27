#!/usr/bin/env node

import program from 'commander';

import { extendConfig } from './extendConfig';
import { checkExtendedConfig } from './checkExtendedConfig';

program.command('*').action(extendConfig);

program.command('check').action(checkExtendedConfig);

program.parse(process.argv);
