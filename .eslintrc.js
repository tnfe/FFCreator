module.exports = {
  root: true,
  parserOptions: {
    parser: require.resolve('babel-eslint'),
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  plugins: [],
  extends: ['eslint:recommended'],
  globals: {
    global: true,
  },
  rules: {
    'no-useless-escape': 0,
    'no-empty': 0,
  },
};
