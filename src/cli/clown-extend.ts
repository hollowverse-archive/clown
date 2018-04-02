import { extendConfig } from '../extendConfig';

async function clownExtend() {
  await extendConfig(process.cwd());
}

clownExtend();
