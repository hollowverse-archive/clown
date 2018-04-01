export type ClownConfig = {
  extensions: string[];
};

export type ExtensionPathAndSourceFiles = [string, string[]];

export type FileContents = {
  [filePath: string]: string;
};

export type Discrepancies = {
  [destinationFilePath: string]: {
    expected: string;
    received: string | undefined;
  };
};
