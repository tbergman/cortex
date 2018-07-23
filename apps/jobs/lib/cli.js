/**
 * A command line script for running jobs for Heroku Scheduler.
 * Runs a file's default function in this directory, e.g. npm run welcome
 */
require(`./${process.argv[2]}`).default()
