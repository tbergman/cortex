const express = require('express')
const home = require('./apps/home')

const { PORT } = process.env
const app = express()
const port = PORT || 3000

app.use(home)

app.listen(port, () => console.log(`Listening on ${port}`))
