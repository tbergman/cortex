module.exports = {
  webpack (config, options) {
    config.module.rules.push({
      test: /\.js$/,
      include: [process.cwd() + '/lib'],
      use: [options.defaultLoaders.babel]
    })
    return config
  }
}
