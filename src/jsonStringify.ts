import detectIndent from 'detect-indent';

function getIndentation(str: string | undefined) {
  if (str) {
    return detectIndent(str).indent;
  }

  return 2;
}

export function jsonStringify(json: any, destinationContent?: string) {
  return `${JSON.stringify(json, null, getIndentation(destinationContent))}\n`;
}
