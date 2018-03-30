export type ClownConfig = {
  extensions: string[];
};

export type ExtensionPathAndSourceFiles = [string, string[]];

export type FileContent = {
  content: string;
  type: 'json' | 'dotIgnore' | 'unknown';
};

export type FileContents = {
  [destinationPath: string]: FileContent;
};
