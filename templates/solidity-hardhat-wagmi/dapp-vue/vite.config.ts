import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), vue({
    template: {
      compilerOptions: {
        isCustomElement: tag => ['appkit-button'].includes(tag),
      },
    },
  })],
})
