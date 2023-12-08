# Nuxt Obfuscator

a nuxt module to easily obfuscate/mangle your css class names when building the project

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/nuxt-obfuscator?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Quick Setup

1. Add `nuxt-obfuscator` dependency to your project

```bash
# Using pnpm
pnpm add -D nuxt-obfuscator

# Using yarn
yarn add --dev nuxt-obfuscator

# Using npm
npm install --save-dev nuxt-obfuscator
```

2. Add `nuxt-obfuscator` to the end of `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    // your other modules
    'nuxt-obfuscator'
  ]
})
```

That's it! You can now use Nuxt Obfuscator in your Nuxt app ✨

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```
