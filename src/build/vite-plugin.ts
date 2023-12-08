import type {Plugin} from 'vite';

import type {ModuleOptions} from '../module';
import {stringContains, stringEndsWith} from '../runtime/postcss/utils';

const classMatcher = /(class\w*?\s*=\s*(['"])?)(.*?)(\2)/gms;

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
            classMatcher,
            (m: string, p1: string, _: string, p3: string, p4: string) => {
              if (m && p3) {
                return `${p1}${p3
                  .split(/\s+/)
                  .map(getObfuscatedClassName)
                  .join(' ')}${p4}`;
              }
              return m;
            },
          );
          return {
            code: transformedCode,
          };
        } catch (e) {
          return {code};
        }
      }
    },
  };
}
