const express = require('express')
const next = require('next')
const _ = require('lodash')
const httpProxy = require('http-proxy')
const jsforceAjaxProxy = require('jsforce-ajax-proxy')

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
app.get('/classes', nextHandler)
app.get('/practices', nextHandler)
app.get('/practices-two', nextHandler)
app.get('/chat', nextHandler)
app.get('/article*', nextHandler)
app.get('/exercise*', nextHandler)
app.get('/static*', nextHandler)
app.get('/_next/*', nextHandler)

app.all('/sfproxy/?*', jsforceAjaxProxy())

app.use((req, res) => {
  proxy.web(req, res, {
    target: 'https://www.zopim.com',
    changeOrigin: true
  })
})

app.use((req, res) => {
  proxy.web(req, res, {
    target: 'https://api.cliniko.com',
    changeOrigin: true
  })
})

module.exports = app
