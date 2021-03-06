// Default: sentry app
module.exports = {
  extends: [
    'sentry-react',

    // These prettier plugins need to be last so they can override plugin rules
    // See https://github.com/prettier/eslint-config-prettier/blob/master/README.md#installation
    // for plugin exclusions
    'prettier',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
    'prettier/react',
    'plugin:import/typescript',
  ],

  parser: '@typescript-eslint/parser',

  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      modules: true,
      legacyDecorators: true,
    },
  },

  env: {
    browser: true,
    es6: true,
    jest: true,
    jquery: true, // hard-loaded into vendor.js
  },

  plugins: ['@typescript-eslint', 'emotion', 'import', 'prettier', 'react', 'sentry', 'simple-import-sort'],

  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
      webpack: {},
    },
    'import/extensions': ['.js', '.jsx'],
  },

  /**
   * Rules
   */
  rules: {
    /**
     * emotion rules for v10
     *
     * This probably aren't as necessary anymore, but let's remove when we move to v11
     */
    'emotion/jsx-import': 'off',
    'emotion/no-vanilla': 'error',
    'emotion/import-from-emotion': 'error',
    'emotion/styled-import': 'error',

    // This only override the `args` rule (which is "none"). There are too many errors and it's difficult to manually
    // fix them all, so we'll have to incrementally update.
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'all',

        // Ignore vars that start with an underscore
        // e.g. if you want to omit a property using object spread:
        //
        //   const {name: _name, ...props} = this.props;
        //
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      },
    ],

    'no-unused-vars': 'off',

    /**
     * Restricted imports, e.g. deprecated libraries, etc
     *
     * See: https://eslint.org/docs/rules/no-restricted-imports
     */
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'enzyme',
            message:
              'Please import from `sentry-test/enzyme` instead. See: https://github.com/getsentry/frontend-handbook#undefined-theme-properties-in-tests for more information',
          },

          {
            name: '@sentry/browser',
            message:
              'Please import from `@sentry/react` to ensure consistency throughout the codebase.',
          },

          {
            name: 'marked',
            message:
              "Please import marked from 'app/utils/marked' so that we can ensure sanitation of marked output",
          },

          {
            name: 'lodash',
            message:
              "Please import lodash utilities individually. e.g. `import isEqual from 'lodash/isEqual';`. See https://github.com/getsentry/frontend-handbook#lodash from for information",
          },
          {
            name: 'lodash/get',
            message:
              'Optional chaining `?.` and nullish coalescing operators `??` are available and preferred over using `lodash/get`. See https://github.com/getsentry/frontend-handbook#new-syntax for more information',
          },
          {
            name: 'react-bootstrap',
            message:
              'Avoid usage of any react-bootstrap components as it will soon be removed',
          },
        ],
      },
    ],

    /**
     * Better import sorting
     */
    'sort-imports': 'off',
    'import/order': 'off',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Side effect imports.
          ['^\\u0000'],

          // Node.js builtins.
          [
            `^(${require("module").builtinModules.join("|")})(/|$)`,
          ],

          // Packages. `react` related packages come first.
          ['^react', '^@?\\w'],

          // Test should be separate from the app
          ['^(sentry-test)(/.*|$)'],

          // Internal packages.
          ['^(sentry-locale|sentry-images)(/.*|$)'],

          ['^(getsentry-images)(/.*|$)'],

          ['^(app|sentry)(/.*|$)'],

          // Getsentry packages.
          ['^(admin|getsentry)(/.*|$)'],

          // Style imports.
          ['^.+\\.less$'],

          // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],

          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
        ],
      },
    ],

    'sentry/no-react-hooks': ['error'],

    'sentry/no-digits-in-tn': ['error'],

    'sentry/no-to-match-snapshot': ['error'],
  },

  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      /**
       * Override rules for typescript files
       */
      rules: {},
    },
  ],
};
