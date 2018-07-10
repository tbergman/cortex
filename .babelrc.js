const conf = require('dotenv').config()
const _ = require('lodash')

module.exports = {
  presets: ['next/babel'],
  plugins: [
    ['transform-define', _.mapKeys(conf.parsed, (v, k) => 'process.env.' + k)]
  ]
}
