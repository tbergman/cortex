const express = require('express')
const next = require('next')
const _ = require('lodash')

const dev = process.env.NODE_ENV !== 'production'
const app = express()
const nextApp = next({ dev, dir: __dirname })
const handle = nextApp.getRequestHandler()
const prepare = _.once(() => nextApp.prepare())

const nextHandler = async (req, res) => {
  await prepare()
  handle(req, res)
}

app.get('/', nextHandler)
app.get('/static*', nextHandler)
app.get('/_next/*', nextHandler)

module.exports = app
