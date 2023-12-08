import {Rule} from 'postcss';
import selectorParser from 'postcss-selector-parser';

import type {ModuleOptions} from '../../module';
import {RandomStringGenerator} from './RandomStringGenerator';
import {stringContains} from './utils';

export default function ({
  moduleOptions,
  isNameUnique,
  getObfuscatedName,
  onAddToMap,
  onFinish,
}: {
  isNameUnique: (className: string) => boolean;
  getObfuscatedName: (className: string) => string | undefined;
  onAddToMap: (className: string, mappedName: string) => void;
  onFinish: () => Promise<void>;
  moduleOptions: ModuleOptions;
}) {
  return {
    postcssPlugin: 'postcss-class-name-obfuscator',
    prepare() {
      const StrGen = new RandomStringGenerator(moduleOptions.nameLength);
      const excludeNameRegexes = Array.from(
        moduleOptions.excludeClassNames,
      ).filter(i => i instanceof RegExp) as RegExp[];

      function shouldSkip(className: string): boolean {
        if (moduleOptions.excludeClassNames.includes(className)) return true;
        for (const re of excludeNameRegexes) {
          if (re.test(className)) return true;
        }
        return false;
      }

      const selectorProcessor = selectorParser(selectors => {
        selectors.walkClasses(
          (node: selectorParser.ClassName | selectorParser.Identifier) => {
            if (shouldSkip(node.value)) return;
            let generatedName: string | undefined = getObfuscatedName(
              node.value,
            );
            if (!generatedName) {
              do {
                generatedName = StrGen.generate();
              } while (!isNameUnique(generatedName));
              onAddToMap(node.value, generatedName);
            }
            node.value = generatedName;
          },
        );
      });

      return {
        Rule(ruleNode: Rule) {
          const absolutePath = ruleNode.source?.input.file;
          if (
            absolutePath &&
            stringContains(absolutePath, moduleOptions.exclude)
          ) {
            return;
          }
          selectorProcessor.process(ruleNode);
        },
        async OnceExit() {
          await onFinish();
        },
      };
    },
  };
}

export const postcss = true;
