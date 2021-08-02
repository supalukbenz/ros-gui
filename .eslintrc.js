module.exports = {
  root: true,
  globals: {
    $: true,
    jQuery: true,
  },
  env: {
    node: true,
    jquery: true,
    es6: true,
    browser: true,
  },
  extends: ['@vue/prettier', 'plugin:vue/essential', 'eslint:recommended'],
  plugins: ['prettier'],
  parserOptions: {
    parser: 'babel-eslint',
    allowImportExportEverywhere: true,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'prettier/prettier': 'error',
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
};
