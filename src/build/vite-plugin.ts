import type {Plugin} from 'vite';

import type {ModuleOptions} from '../module';
import {stringContains, stringEndsWith} from '../runtime/postcss/utils';

const quotesMatcher = /(["'])(.*?)(?=\1)/gm;

export function obfuscatorVitePlugin(
  options: ModuleOptions,
  getObfuscatedClassName: (className: string) => string,
): Plugin {
  return {
    name: 'nuxt-obfuscator-template-mapper',
    enforce: 'pre',
    transform(code, id) {
      if (stringContains(id, options.exclude)) return;
      if (stringEndsWith(id, options.defaultExtensions)) {
        try {
          const transformedCode = code.replace(
            quotesMatcher,
            (m: string, p1: string, p2: string) => {
              if (m && p2) {
                let replacement: string;
                if (quotesMatcher.test(p2)) {
                  replacement =
                    p1 +
                    p2.replace(
                      quotesMatcher,
                      (_, ep1, ep2) =>
                        ep1 +
                        ep2.split(/\s+/).map(getObfuscatedClassName).join(' '),
                    );
                } else {
                  replacement = `${p1}${p2
                    .split(/\s+/)
                    .map(getObfuscatedClassName)
                    .join(' ')}`;
                }
                return replacement;
              }
              return m;
            },
          );
          return {
            code: transformedCode,
            map: null,
          };
        } catch (e) {
          return {code, map: null};
        }
      }
    },
  };
}
