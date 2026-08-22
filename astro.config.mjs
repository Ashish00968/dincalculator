import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://dincalculatorpro.com',
  integrations: [react(), sitemap({
    i18n: {
      defaultLocale: 'en',
      locales: {
        en: 'en',
        de: 'de',
        fr: 'fr',
        it: 'it',
        es: 'es',
        ja: 'ja',
        sv: 'sv',
        no: 'no',
        nl: 'nl',
        pl: 'pl',
        cs: 'cs',
        fi: 'fi'
      }
    }
  })],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'fr', 'it', 'es', 'ja', 'sv', 'no', 'nl', 'pl', 'cs', 'fi'],
    routing: {
      prefixDefaultLocale: false,
    }
  },
  vite: {
    plugins: [tailwindcss()],
    css: {
      postcss: {
        plugins: [],
      },
    },
  },
  output: 'static',
});