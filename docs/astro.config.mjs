// @ts-check
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import astroTakumi from 'astro-takumi';
import { renderOgImage } from './src/og/og-template.ts';

const require = createRequire(import.meta.url);

// Read a @fontsource font binary by resolving the package, so it works regardless
// of where the workspace hoists node_modules.
function font(pkg, file) {
  const pkgDir = dirname(require.resolve(`${pkg}/package.json`));
  return readFileSync(join(pkgDir, 'files', file));
}

// https://astro.build/config
export default defineConfig({
  site: 'https://www.createdot.app',
  integrations: [
    sitemap(),
    // Renders the OpenGraph image for every page into dist/<page>.png at build time,
    // reading the og:* meta tags emitted by Layout.astro.
    astroTakumi({
      options: {
        width: 1200,
        height: 630,
        format: 'png',
        fonts: [
          font('@fontsource/space-grotesk', 'space-grotesk-latin-400-normal.woff'),
          font('@fontsource/space-grotesk', 'space-grotesk-latin-700-normal.woff'),
          font('@fontsource/jetbrains-mono', 'jetbrains-mono-latin-400-normal.woff'),
        ],
      },
      render: renderOgImage,
    }),
  ],
});
