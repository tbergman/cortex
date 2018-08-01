const env = require('dotenv').config()
const _ = require('lodash')

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true
        }
      }
    ],
    'next/babel'
  ],
  plugins: [
    ['transform-define', _.mapKeys(env.parsed, (v, k) => 'process.env.' + k)],
    [
      'module-resolver',
      {
        root: ['./lib']
      }
    ]
  ],
  env: {
    test: {
      presets: [['next/babel', { 'preset-env': { modules: 'commonjs' } }]]
    }
  }
}
