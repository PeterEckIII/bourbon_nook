import js from '@eslint/js';
import pluginQuery from '@tanstack/eslint-plugin-query';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['src/routes/**/*.tsx'],
    rules: {
      // TanStack Router's file-based routes always export both a `Route`
      // object and a component; this rule can't be satisfied by that shape.
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['src/auth/auth.tsx'],
    rules: {
      'react-refresh/only-export-components': [
        'error',
        { allowExportNames: ['useAuth'] },
      ],
    },
  },
  ...pluginQuery.configs['flat/recommended-strict'],
]);
