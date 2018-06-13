const express = require('express')
const next = require('next')
const _ = require('lodash')

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev, dir: __dirname })
const handle = nextApp.getRequestHandler()
const expressApp = express()
const prepare = _.once(() => nextApp.prepare())

expressApp.get('*', async (req, res) => {
  await prepare()
  handle(req, res)
})

module.exports = expressApp
