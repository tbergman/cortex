const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')

module.exports = {
  webpack: config => {
    config.plugins.push(
      new SWPrecacheWebpackPlugin({
        verbose: true,
        staticFileGlobsIgnorePatterns: [/\.next\//],
        importScripts: ['/static/foo.js'],
        runtimeCaching: [
          {
            handler: 'networkFirst',
            urlPattern: /^http?.*/
          }
        ]
      })
    )

    return config
  }
}
