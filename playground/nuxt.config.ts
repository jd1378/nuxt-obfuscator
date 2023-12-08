export default defineNuxtConfig({
  modules: ['../src/module'],
  obfuscator: {
    dev: true,
  },
  devtools: {enabled: true},
});
