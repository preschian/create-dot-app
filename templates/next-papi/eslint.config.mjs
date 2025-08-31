import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const config = [
  {
    ignores: ['app/descriptors/**'],
  },
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript'],
  }),
]

export default config
