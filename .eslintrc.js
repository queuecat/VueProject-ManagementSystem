// 只要添加/* eslint-disable */，本文件中在/* eslint-disable */之后所有的代码只要存在[eslint] Strings must use singlequote. (quotes)都会被默认进行处理

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
    'no-console': 'off',
    'no-debugger': 'off',
    'semi': ["error", "always"],// 每条JS语句必须以 ; 结尾，否则会报错
  },

  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ]
}
