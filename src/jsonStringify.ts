import detectIndent from 'detect-indent';
import sortKeys from 'sort-keys';

function getIndentation(str: string | undefined) {
  if (str) {
    return detectIndent(str).indent;
  }

  return 2;
}

export function jsonStringify(json: any, destinationContent?: string) {
  if (json.dependencies) {
    json.dependencies = sortKeys(json.dependencies);
  }

  if (json.devDependencies) {
    json.devDependencies = sortKeys(json.devDependencies);
  }

  return `${JSON.stringify(json, null, getIndentation(destinationContent))}`;
}
