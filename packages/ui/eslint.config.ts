import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'type',
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
          ],

          pathGroups: [
            // React first
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'react-dom',
              group: 'external',
              position: 'before',
            },

            // Workspace imports as internal
            {
              pattern: '@workspace/**',
              group: 'internal',
              position: 'after',
            },

            // Other @ aliases, but not @workspace
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],

          pathGroupsExcludedImportTypes: ['builtin'],

          'newlines-between': 'always',

          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
]
