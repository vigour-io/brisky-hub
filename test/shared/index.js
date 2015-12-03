'use strict'
module.exports = function (protocol, key) {
  require('./set')(protocol, key)
  require('./reconnect')(protocol, key)
}
