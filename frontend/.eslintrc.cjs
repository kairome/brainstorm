module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'airbnb-typescript'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts'],
  parser: '@typescript-eslint/parser',
  'parserOptions': {
    'project': 'tsconfig.json'
  },
  plugins: ['react-refresh', '@typescript-eslint', 'react', 'import'],
  rules: {
    'react-refresh/only-export-components': 0,
    'import/no-cycle': 0,
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    'import/no-webpack-loader-syntax': 0,
    'import/order': [
      'error',
      {
        'groups': [
          'builtin',
          'external',
          'internal'
        ],
        'newlines-between': 'always'
      }
    ],
    'import/no-named-as-default': 0,
    'semi': 2,
    'quote-props': [
      'error',
      'consistent-as-needed'
    ],
    'jsx-quotes': ['error', 'prefer-double'],
    'lines-between-class-members': [
      'error',
      'always',
      {
        'exceptAfterSingleLine': true
      }
    ],
    'max-len': [
      2,
      {
        'code': 120,
        'ignoreStrings': true
      }
    ],
    'arrow-parens': [
      2,
      'as-needed',
      {
        'requireForBlockBody': true
      }
    ],
    'arrow-body-style': 0,
    'func-names': [
      'error',
      'always',
      {
        'generators': 'never'
      }
    ],
    'implicit-arrow-linebreak': 0,
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
    'object-shorthand': 'error',
    'no-confusing-arrow': 0,
    'function-paren-newline': 0,
    'camelcase': 0,
    'no-trailing-spaces': [
      2,
      {
        'skipBlankLines': true
      }
    ],
    'no-multiple-empty-lines': [
      2,
      {
        'max': 1,
        'maxEOF': 0
      }
    ],
    'class-methods-use-this': 0,
    'no-restricted-globals': 0,
    'no-case-declarations': 0,
    'no-console': [
      'error',
      {
        'allow': [
          'error',
          'warning',
          'info'
        ]
      }
    ],
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/control-has-associated-label': 0,
    'jsx-a11y/mouse-events-have-key-events': 0,
    'jsx-a11y/media-has-caption': 0,
    'jsx-a11y/no-autofocus': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'indent': [
      'error',
      2,
      {
        'SwitchCase': 1
      }
    ],
    'react/no-danger': 0,
    'react/jsx-indent': [
      1,
      2
    ],
    'react/jsx-indent-props': [
      1,
      2
    ],
    'react/destructuring-assignment': 0,
    'react/prop-types': 0,
    'react/jsx-fragments': 0,
    'react/jsx-props-no-spreading': 0,
    'react/state-in-constructor': 0,
    'react/static-property-placement': 0,
    'react/jsx-first-prop-new-line': [
      'error',
      'multiline-multiprop'
    ],
    'react/jsx-max-props-per-line': ['error', {
      'maximum': {
        'single': 3,
        'multi': 1
      }
    }],
    'react/jsx-closing-bracket-location': 1,
    'react/jsx-curly-spacing': [
      'error',
      {
        'when': 'never',
        'allowMultiline': false,
        'children': true
      }
    ],
    'react/jsx-curly-brace-presence': [
      'error',
      { 'props': 'never', 'children': 'never' }
    ],
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/default-param-last': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-implied-eval': 0,
    '@typescript-eslint/no-throw-literal': 0,
    '@typescript-eslint/naming-convention': 0,
    '@typescript-eslint/member-delimiter-style': [
      1,
      {
        'multiline': {
          'delimiter': 'comma'
        },
        'singleline': {
          'delimiter': 'comma'
        }
      }
    ]
  },
};
