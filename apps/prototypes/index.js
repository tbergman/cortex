const express = require('express')
const next = require('next')
const _ = require('lodash')
const httpProxy = require('http-proxy')

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev, dir: __dirname })
const handle = nextApp.getRequestHandler()
const app = express()
const proxy = httpProxy.createProxyServer()
const prepare = _.once(() => nextApp.prepare())

const nextHandler = async (req, res) => {
  await prepare()
  handle(req, res)
}

app.get('/schedule', nextHandler)
app.get('/_next/*', nextHandler)

app.use((req, res) => {
  proxy.web(req, res, {
    target: 'https://api.cliniko.com',
    changeOrigin: true
  })
})

module.exports = app
