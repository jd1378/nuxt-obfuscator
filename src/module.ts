import {readFile, writeFile} from 'node:fs/promises';

import {addVitePlugin, createResolver, defineNuxtModule} from '@nuxt/kit';
import invert from 'lodash.invert';

import {obfuscatorVitePlugin} from './build/vite-plugin';

export interface ModuleOptions {
  /** where to store class name mappings */
  mapFile: string;
  /** how many characters each class name should be */
  nameLength: number;
  /**  which file extensions to check for class names */
  defaultExtensions: Array<string>;
  /** if path includes these keywords it will be ignored */
  exclude: Array<string>;
  excludeClassNames: Array<string | RegExp>;
  /** if true, class names will be obfuscated in development */
  dev: boolean;
}

const defaultOptions: ModuleOptions = {
  mapFile: 'obfuscation.map.json',
  nameLength: 7,
  defaultExtensions: ['.html', '.vue', '.jsx', '.tsx'],
  exclude: ['node_modules'],
  excludeClassNames: [],
  dev: false,
};

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-obfuscator',
    configKey: 'obfuscator',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  // Default configuration options of the Nuxt module
  defaults: {
    mapFile: defaultOptions.mapFile,
    nameLength: defaultOptions.nameLength,
    defaultExtensions: [],
    exclude: [],
    excludeClassNames: [],
    dev: defaultOptions.dev,
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    const rootResolver = createResolver(nuxt.options.rootDir);
    const pluginPath = resolver.resolve('./postcss/class_name_obfuscator');
    const mapPath = rootResolver.resolve(options.mapFile);

    if (!options.defaultExtensions.length) {
      options.defaultExtensions = defaultOptions.defaultExtensions;
    }
    if (!options.exclude.length) {
      options.exclude = defaultOptions.exclude;
    }

    const classMapping: Record<string, string> = {};
    const classMappingInverted: Record<string, string> = {};

    async function updateClassMappingFile() {
      await writeFile(mapPath, JSON.stringify(classMapping));
    }

    try {
      const fileContent = await readFile(mapPath, {encoding: 'utf-8'});
      const map = JSON.parse(fileContent);
      Object.assign(classMapping, map);
      Object.assign(classMappingInverted, invert(map));
    } catch (err: any) {
      if (err?.code === 'ENOENT') {
        await updateClassMappingFile();
      } else {
        throw err;
      }
    }

    nuxt.hook('build:before', () => {
      nuxt.options.postcss.plugins = {
        ...nuxt.options.postcss.plugins,
        [pluginPath]: {
          moduleOptions: options,
          isNameUnique(className: string) {
            return !(className in classMappingInverted);
          },
          getObfuscatedName(className: string) {
            return classMapping[className];
          },
          onAddToMap(className: string, generatedName: string) {
            classMapping[className] = generatedName;
            classMappingInverted[generatedName] = className;
          },
          async onFinish() {
            await updateClassMappingFile();
          },
        },
      };
    });
    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addVitePlugin(
      obfuscatorVitePlugin(options, cName => {
        return classMapping[cName] || cName;
      }),
    );
  },
});
