import express from 'express'
import { mountAppsDir } from 'next-to-express'

const { PORT } = process.env
const app = express()
const port = PORT || 3000

// Mount sub apps and start server
;(async () => {
  await mountAppsDir(app)
  app.listen(port, () => console.log(`Listening on http://localhost:${port}`))
})().catch(console.error)
