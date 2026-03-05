// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

// Book-only build config — outputs to dist-book/
// Usage: npm run build:book
export default defineConfig({
  base: '/product-judgment/',
  outDir: 'dist-book',
  integrations: [react(), mdx()],
});
