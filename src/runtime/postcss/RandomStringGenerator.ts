import {customAlphabet} from 'nanoid';

const alphabets = '_abcdefghijklmnopqrstuvwxyz-';

export class RandomStringGenerator {
  private nanoid: (size: number) => string;
  private length: number;

  constructor(length: number) {
    this.length = length;
    this.nanoid = customAlphabet(alphabets, length);
  }

  /** for the same input will always give the same output */
  generate() {
    return this.nanoid(this.length);
  }
}
