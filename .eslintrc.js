module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    mocha: true,
  },
  plugins: ['mocha'],
  extends: [
    'airbnb-base',
    'plugin:mocha/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'comma-dangle': 0,
    'no-console': 0,
    'prettier/prettier': 0,
    'linebreak-style': [
      'error',
      process.platform === 'win32' ? 'windows' : 'unix',
    ],
    'mocha/valid-test-description': [
      'error',
      /^should/,
      ['it', 'specify', 'test'],
      'Should start with "should"',
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
      },
    ],
    'no-param-reassign': ['error', { props: false }],
  },
};
