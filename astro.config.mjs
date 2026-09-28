import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { isIndexablePath } from './src/i18n/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://dincalculatorpro.com',
  trailingSlash: 'always',
  prefetch: {
    defaultStrategy: 'viewport',
  },
  integrations: [
    preact({ compat: true }),
    sitemap({
      filter: (page) => isIndexablePath(page),
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          de: 'de',
          fr: 'fr',
          it: 'it'
        }
      }
    })
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'fr', 'it', 'es', 'ja', 'sv', 'no', 'nl', 'pl', 'cs', 'fi'],
    routing: {
      prefixDefaultLocale: false,
    }
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['@astrojs/preact', 'astro:preact:opts'],
    },
    css: {
      postcss: {
        plugins: [],
      },
    },
  },
  output: 'static',
});