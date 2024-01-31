import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import postcssNesting from 'postcss-nesting';
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  css: {
    postcss: {
      plugins: [
        postcssNesting
      ],
    },
  },
});
