'use strict'
module.exports = function (protocol, key) {
  require('./constructor.js')
  require('./protocol')
  require('./set')(protocol, key)
  require('./reconnect')(protocol, key)
  require('./client')(protocol, key)
}
