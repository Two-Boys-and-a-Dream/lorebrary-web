import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tanstackQuery from '@tanstack/eslint-plugin-query'
import jest from 'eslint-plugin-jest'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  // Ignore patterns
  {
    ignores: ['dist/**', 'coverage/**', '.parcel-cache/**', 'node_modules/**'],
  },

  // Base JavaScript config
  js.configs.recommended,

  // General settings for all files
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // React configuration
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      '@tanstack/query': tanstackQuery,
    },
    rules: {
      // React recommended rules
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...tanstackQuery.configs.recommended.rules,

      // Strict error prevention
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'warn',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'no-duplicate-imports': 'error',

      // React specific
      'react/prop-types': 0,
      'react/jsx-no-target-blank': 'error',
      'react/jsx-key': [
        'error',
        {
          checkFragmentShorthand: true,
          checkKeyMustBeforeSpread: true,
        },
      ],
      'react/no-array-index-key': 'warn',
      'react/no-unstable-nested-components': 'error',
      'react/jsx-no-useless-fragment': 'warn',
      'react/jsx-curly-brace-presence': [
        'warn',
        {
          props: 'never',
          children: 'never',
        },
      ],
      'react/self-closing-comp': [
        'warn',
        {
          component: true,
          html: true,
        },
      ],
      'react/jsx-boolean-value': ['warn', 'never'],

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Code quality
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-implicit-coercion': 'error',
      'prefer-template': 'warn',
      'object-shorthand': ['warn', 'always'],
      'no-nested-ternary': 'warn',
      'no-unneeded-ternary': 'warn',
    },
  },

  // Jest configuration for test files
  {
    files: ['**/*.test.js', '**/*.spec.js'],
    plugins: {
      jest,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      ...jest.configs.recommended.rules,
    },
  },

  // Prettier config (must be last to override other configs)
  prettier,
]
