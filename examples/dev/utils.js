var chalk = require('chalk')

module.exports.log = {
  info () {
    arguments[0] = chalk.black.bgBlue(arguments[0])
    console.log.apply(this, arguments)
  },
  error () {
    arguments[0] = chalk.black.bgRed(arguments[0])
    console.log.apply(this, arguments)
  }
}
