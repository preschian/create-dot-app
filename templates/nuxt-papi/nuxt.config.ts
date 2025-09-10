import tailwindcss from '@tailwindcss/vite'
import { name } from './package.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],

  eslint: {
    config: {
      standalone: false,
    },
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
  vite: {
    plugins: [tailwindcss()],
  },
})
