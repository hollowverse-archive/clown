import diff from 'jest-diff';
import { Discrepancies } from './types';
import _ from 'lodash';
import chalk from 'chalk';

// tslint:disable:no-console
export function printErrors(discrepancies: Discrepancies) {
  _.each(discrepancies, ({ expected, received }, filePath) => {
    console.log(`\n\n${chalk.bold.underline(filePath)}`);

    console.log(
      diff(expected, received || '\n', {
        aAnnotation: received
          ? 'What it should be'
          : 'Expected to exist with content',
        bAnnotation: received ? 'What it is' : 'It does not exist',
        contextLines: 5,
      }),
    );
  });
}
