/* The reason this function is in its own module is so it becomes
easier to mock it with Jest. */
export function getClownConfig(path: string) {
  return require(path);
}
