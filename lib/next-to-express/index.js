/**
 * A library to mount Next app directories as Express middleware.
 *
 * This is a compromise to doing the Next.js blessed microservice approach of
 * using "zones" to allow simpler deployment/maintenance in the early days.
 * https://github.com/zeit/next.js#multi-zones
 */
import express from 'express'
import next from 'next'
import _ from 'lodash'
import path from 'path'
import fs from 'fs'

const dev = process.env.NODE_ENV !== 'production'

const findPageNames = async dir => {
  const files = await new Promise((resolve, reject) =>
    fs.readdir(
      path.resolve(dir, 'pages'),
      (err, res) => (err ? reject(err) : resolve(res))
    )
  )
  return files.filter(f => !f.match(/^_/)).map(f => f.replace('.js', ''))
}

/**
 *  Converts a Next directory into express middleware
 *
 * @param {string} dir A Next app directory
 * @returns {object} An express app
 */
export const dirToMiddleware = async dir => {
  const pathPrefix = '/' + path.parse(dir).base
  const pages = await findPageNames(dir)

  // Setup the next app instance with an asset prefix by directory basename.
  // Create express middleware that prepares the app and handles the request.
  const nextApp = next({ dev, dir })
  const app = express()
  const handle = nextApp.getRequestHandler()
  const prepare = _.once(async () => {
    await nextApp.prepare()
    nextApp.setAssetPrefix(pathPrefix)
  })
  const nextHandler = async (req, res) => {
    await prepare()
    handle(req, res)
  }

  // Re-route asset requests to that prefix
  // TODO: Open issue with Next about assuming `assetPrefix` is only a hostname
  // or another port e.g. localhost:5000 or cdn.foo.com vs. localhost:5000/foo
  app.get(pathPrefix + '/_next*', (req, res, next) => {
    req.url = req.url.replace(pathPrefix, '')
    nextHandler(req, res)
  })

  // Whitelist routes based on pages
  pages.forEach(page => {
    if (page === 'index') app.get('/', nextHandler)
    app.get('/' + page, nextHandler)
  })

  // Use express's static asset middleware b/c it passes on control vs.
  // Next's static middle termininating the request with a 404 if not found.
  app.use('/static', express.static(path.resolve(dir, 'static')))

  return app
}

/**
 * Mounts an /apps directory full of Next apps to an express app.
 *
 * @param {object} expressApp Instance of a parent express app
 * @param {string} [rootDir = process.cwd()] Directory containing Next apps
 */
export const mountAppsDir = async (expressApp, rootDir = process.cwd()) => {
  const appNames = async () =>
    new Promise((resolve, reject) =>
      fs.readdir(
        path.resolve(rootDir, 'apps'),
        (err, names) => (err ? reject(err) : resolve(names))
      )
    )
  const names = await appNames()
  const apps = await Promise.all(
    names.map(name => dirToMiddleware(path.resolve(rootDir, 'apps', name)))
  )
  apps.forEach(subApp => expressApp.use(subApp))
}
