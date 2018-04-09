import { extendConfig } from '../extendConfig';
import bluebird from 'bluebird';

async function clownExtend() {
  await extendConfig(process.cwd());
}

bluebird
  .try(async () => {
    await clownExtend();
  })
  .catch(error => {
    console.error('Error while running `clownExtend`:', error.message);
    process.exit(1);
  });
