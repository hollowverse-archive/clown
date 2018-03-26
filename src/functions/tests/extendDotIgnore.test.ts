import { extendDotIgnore } from '../extendDotIgnore';
import { readFile } from '../../cli/utils';
import path from 'path';
import { stripIndents } from 'common-tags';

describe('extendDotIgnore', () => {
  it('works 1', async () => {
    const destination = stripIndents`
      # comment
      node_modules

      # another comment
      .idea
    `;
    const source = stripIndents`
      # new stuff
      bin
    `;

    expect(extendDotIgnore(destination, source)).toEqual(stripIndents`
      # comment
      node_modules

      # another comment
      .idea

      # new stuff
      bin
    `);
  });

  it('works 2', async () => {
    const destination = stripIndents`
      # comment
      node_modules

      # another comment
      .idea
    `;
    const source = stripIndents`
      # comment
      node_modules

      # another comment
      .idea
    `;

    expect(extendDotIgnore(destination, source)).toEqual(stripIndents`
      # comment
      node_modules

      # another comment
      .idea
    `);
  });
});
