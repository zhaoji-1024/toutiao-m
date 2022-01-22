module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-mixed-spaces-and-tabs': 'off',
    'Unexpected tab character': 'off',
    'no-tabs': 'off',
    'space-before-function-paren': 'off',
    'object-curly-spacing': 'off',
    indent: 'off',
    'eol-last': 'off',
    'comma-dangle': 'off',
    'no-trailing-spaces': 'off',
    'padded-blocks': 'off',
    'no-multi-spaces': 'off',
    'spaced-comment': 'off',
    'keyword-spacing': 'off',
    'space-before-blocks': 'off',
    camelcase: 'off',
    'no-undef': 'off'
  }
}
