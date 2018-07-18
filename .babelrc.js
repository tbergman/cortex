const env = require('dotenv').config()
const _ = require('lodash')

module.exports = {
  presets: ['next/babel'],
  plugins: [
    ['transform-define', _.mapKeys(env.parsed, (v, k) => 'process.env.' + k)],
    [
      'module-resolver',
      {
        root: ['./lib'],
        alias: {
          test: './test',
          underscore: 'lodash'
        }
      }
    ]
  ],
  env: {
    test: {
      presets: [['next/babel', { 'preset-env': { modules: 'commonjs' } }]]
    }
  }
}
