module.exports = {
  root: true,
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
  env: { browser: true, node: true, es2021: true },
  ignorePatterns: ['dist', 'node_modules'],
  extends: ['eslint:recommended'],
  rules: {}
};
