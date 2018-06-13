const express = require('express')
const app = express()

app.use('/playground', express.static(`${__dirname}/static`))
app.get('/playground', (req, res) => res.send('Hello World!'))

module.exports = app
