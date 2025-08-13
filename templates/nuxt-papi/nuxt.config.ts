import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  ssr: false,
  vite: {
    plugins: [tailwindcss()],
  },
  css: ['~/assets/css/main.css'],
})
