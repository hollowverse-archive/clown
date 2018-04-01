import { checkExtendedConfig } from '../checkExtendedConfig';

async function clownCheckExtendedConfig() {
  await checkExtendedConfig(process.cwd());
}

clownCheckExtendedConfig();
