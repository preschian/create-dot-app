import antfu from '@antfu/eslint-config'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

export default antfu(
  {
    formatters: true,
    react: true,
  },
  ...compat.config({
    extends: [
      'plugin:@next/next/recommended',
    ],
  }),
)
