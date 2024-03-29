import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import postcssNesting from 'postcss-nesting';
import tsconfigPaths from 'vite-tsconfig-paths'
import svgr from "vite-plugin-svgr";
import postcssCustomMedia from 'postcss-custom-media';


export default defineConfig({
  plugins: [svgr(), react(), tsconfigPaths()],
  css: {
    postcss: {
      plugins: [
        postcssNesting,
        postcssCustomMedia,
      ],
    },
  },
});
