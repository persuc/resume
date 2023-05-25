import { fileURLToPath, URL } from "url";
// import decomp from 'poly-decomp'
// import decompPlugin from './src/decomp-plugin'

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // decompPlugin()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // optimizeDeps: {
  //   include: ['poly-decomp'],
  // },
  build: {
    rollupOptions: {
      external: ['poly-decomp'],
//       output: {
//         footer: `
// for (const key of Object.keys(globalThis.moduleName)) {
//   globalThis[key] = globalThis.moduleName[key]
// }
// `
//       }
    }
  }
  // server: {
  //   host: true
  // },
});

// eslint-disable-next-line import/prefer-default-export
// (window as any).decomp = decomp
