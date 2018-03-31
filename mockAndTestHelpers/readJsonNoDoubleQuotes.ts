import { fs } from '@forabi/memfs';

/* Jest, when doing snapshots, wraps strings in double quotes. Since JSON keys and string values
are also wrapped in double quotes, Jest finds itself needing to escape all the double quotes in a
JSON, so the JSON becomes cluttered with \\" \\" \\" \\", making it unreadable. The function
below substitutes double quotes for single quotes when reading JSON content from the mock disk,
so there wouldn't be double-quote escaping issues. */
export function readJsonNoDoubleQuotes(filePathInDisk: string) {
  return (fs.readFileSync(filePathInDisk, 'utf8') as string).replace(/"/g, "'");
}
