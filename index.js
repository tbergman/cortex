import envenc from 'envenc'
import { createReloadable } from '@artsy/express-reloadable'
import { dirToMiddleware } from 'next-to-express'
import express from 'express'
import path from 'path'
if (process.env.NODE_ENV === 'development') envenc(process.env.CORTEX_ENV_KEY)

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
    dirToMiddleware(path.resolve(__dirname, 'apps', 'marketing')),
    dirToMiddleware(path.resolve(__dirname, 'apps', 'portal'))
  ])
  nextApps.forEach(nextApp => app.use(nextApp))

  // Mount non-Next apps
  app.use(reloadableApp(path.resolve(__dirname, 'apps', 'api')))

  // 404
  app.get('*', (req, res) => res.status(404).send('Page not found'))

  // Start server
  app.listen(PORT, () =>
    console.log(`🧠  The neurons are firing: http://localhost:${PORT}`)
  )
}

main().catch(console.error)
