import path from 'path';

export function normalizeBasename(filePath: string) {
  const basename = path.basename(filePath);

  return basename.startsWith('c__')
    ? path.join(path.dirname(filePath), basename.slice(3))
    : filePath;
}
