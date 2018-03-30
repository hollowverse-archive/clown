type Content = {
  [name: string]: any;
};

class Disk {
  content: Content = {};

  setContent = (content: Content) => {
    this.content = content;
  };

  write = (filePath: string, content: string) => {
    this.content[filePath] = content;
  };

  read = (filePath: string) => {
    return Promise.resolve(this.content[filePath]);
  };

  clear = () => {
    this.content = {};
  };

  getContent = () => {
    return this.content;
  };
}

export const disk = new Disk();
