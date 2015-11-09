var colors = require('colors-browserify')

module.exports.log = {
  info (title, data) {
    console.log(title.bgBlue.white)
    console.log(data)
  },
  error (title, data) {
    console.log(title.bgRed.white)
    console.log(data)
  }
}
