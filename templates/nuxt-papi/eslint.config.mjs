import { createConfigForNuxt } from '@nuxt/eslint-config'

export default createConfigForNuxt({}).override('nuxt/rules', {
  rules: {
    'vue/multi-word-component-names': 0,
  }
})