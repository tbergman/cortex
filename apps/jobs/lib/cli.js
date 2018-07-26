/**
 * A command line script for running jobs for Heroku Scheduler.
 * Runs a file's default function in this directory, e.g. npm run welcome
 */
import chalk from 'chalk'
import util from 'util'

require(`./${process.argv[2]}`)
  .default()
  .catch(err => console.error(chalk.red(util.inspect(err))))
