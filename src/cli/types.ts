export type HecConfig = {
  extensionsModule: string;
  extensions: string[];
};

export type ExtensionPathAndSourceFiles = [string, string[]];

export type Change = {
  content: string;
  type: 'json' | 'dotIgnore' | 'unknown';
};

export type Changes = {
  [destinationPath: string]: Change;
};
