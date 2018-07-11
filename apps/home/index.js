const express = require('express')
const app = express()

app.use('/', express.static(`${__dirname}/static`))
app.get('/', (req, res) => res.send('Hello World!'))

module.exports = app
