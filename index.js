import { createReloadable } from '@artsy/express-reloadable'
import { dirToMiddleware } from 'next-to-express'
import express from 'express'
import path from 'path'

const { PORT, NODE_ENV } = process.env
const app = express()

const reloadableApp = dir => {
  const subApp = require(dir).default
  if (NODE_ENV === 'development') {
    const mountAndReload = createReloadable(subApp, require)
    return mountAndReload(dir)
  } else {
    return subApp
  }
}

const main = async () => {
  // Mount Next apps
  const nextApps = await Promise.all([
    dirToMiddleware(path.resolve(__dirname, 'apps', 'prelaunch')),
    dirToMiddleware(path.resolve(__dirname, 'apps', 'marketing'))
  ])
  nextApps.forEach(nextApp => app.use(nextApp))

  // Mount non-Next apps
  app.use(reloadableApp(path.resolve(__dirname, 'apps', 'api')))

  // Start server
  app.listen(PORT, () =>
    console.log(`🧠  The neurons are flowing: http://localhost:${PORT}`)
  )
}

main().catch(console.error)
