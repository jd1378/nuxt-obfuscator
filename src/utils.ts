export function stringEndsWith(str: string, words: Array<string>) {
  return words.length && words.some(w => str.endsWith(w));
}

export function stringContains(str: string, words: Array<string>) {
  return words.length && words.some(w => str.includes(w));
}
