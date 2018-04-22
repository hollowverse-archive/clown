import path from 'path';

export function normalizeBasename(filePath: string) {
  const basename = path.basename(filePath);

  if (basename.startsWith('c__')) {
    const dirname = path.dirname(filePath);
    const normalizedBasename = path.basename(filePath).slice(3);

    return path.join(dirname, normalizedBasename);
  }

  return filePath;
}
