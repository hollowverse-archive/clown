export type ClownConfig = {
  extensions: string[];
};

export type ExtensionPathAndSourceFiles = [string, string[]];

export type FileContent = {
  destinationContent: string | undefined;
  computedContent: string;
  type: 'json' | 'dot-ignore' | 'unknown';
};

export type FileContents = {
  [filePath: string]: FileContent;
};

export type Discrepancies = {
  [destinationFilePath: string]: {
    expected: string;
    received: string | undefined;
  };
};

export type ExtendJson = (destination: any, source: any) => any;
