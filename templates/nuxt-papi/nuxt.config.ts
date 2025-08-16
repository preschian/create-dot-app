import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@nuxt/eslint'],

  eslint: {
    config: {
      standalone: false,
    },
  },

  app: {
    head: {
      htmlAttrs: {
        'data-theme': 'light',
      },
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  css: ['~/assets/css/main.css'],
})
