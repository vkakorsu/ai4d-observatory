import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'media/**',
    'next-env.d.ts',
    'src/app/(payload)/admin/importMap.js',
    'src/payload-types.ts',
    'src/migrations/**',
  ]),
])
