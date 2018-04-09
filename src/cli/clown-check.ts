import { checkExtendedConfig } from '../checkExtendedConfig';
import bluebird from 'bluebird';

async function clownCheckExtendedConfig() {
  await checkExtendedConfig(process.cwd());
}

bluebird
  .try(async () => {
    await clownCheckExtendedConfig();
  })
  .catch(error => {
    console.error('Error while running `checkExtendedConfig`:', error.message);
    process.exit(1);
  });
