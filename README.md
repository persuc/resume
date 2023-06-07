# My resume

See the live site at https://persic.cloud

Simple SPA built with Vue 3 & Vite. Houses my resume, contact info and some hiring details. My goals with this site were:
- To build it without using too many frameworks (in the past I have use nuxt.js, tailwind, vuetify) since I wanted to understand how to build components, styles and other common elements from the ground up.
- Not to spend too long (the main pages were completed in a matter of hours)
- To show some real examples of code, not contrived examples that I have spent a lot of time making look good
- Hide some fun stuff for people to find if they look carefully

## Deployment

Deployed with [Cloudflare Pages](https://pages.cloudflare.com/) as an SPA

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin) to make the [TypeScript language service](https://github.com/microsoft/TypeScript/wiki/Using-the-Language-Service-API) aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Project Setup

```sh
yarn
```

### Project commands

Compile and Hot-Reload for Development:

```sh
yarn dev
```

Type-Check, Compile and Minify for Production:

```sh
yarn build
```

Type-Check, Compile, Minify for Production and Start Development Server:

```sh
yarn preview
```

Lint with [ESLint](https://eslint.org/):

```sh
yarn lint
```

Rebundle Dependencies and Start Development Server:

```sh
yarn clean
```

## Contributing

I am accepting contributions to my physics game [Super Sicko Draw Mode](https://persic.cloud/draw) (name not finalised). See [CONTRIBUTORS.md](./CONTRIBUTORS.md)

## License

Source code is licensed under the GPL3 license.

Contents of this site are © Copyright 2023 Andrew Persic. All rights reserved.