const express = require('express')
const playground = require('./apps/playground')
const prototypes = require('./apps/prototypes')
const home = require('./apps/home')

const { PORT } = process.env
const app = express()
const port = PORT || 3000

app.use(playground)
app.use(prototypes)
app.use(home)

app.listen(port, () => console.log(`Listening on ${port}`))
