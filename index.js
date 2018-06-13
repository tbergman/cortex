const express = require('express')
const playground = require('./apps/playground')
const prototypes = require('./apps/prototypes')

const { PORT } = process.env
const app = express()
const port = PORT || 3000

app.use(playground)
app.use(prototypes)

app.listen(port, () => console.log(`Listening on ${port}`))
