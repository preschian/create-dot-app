import { name } from './package.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/ui'],

  eslint: {
    config: {
      standalone: false,
    },
  },

  ui: {
    colorMode: false,
  },

  app: {
    head: {
      title: name,
      htmlAttrs: {
        'data-theme': 'light',
      },
    },
  },

  css: ['~/assets/css/main.css'],
})
