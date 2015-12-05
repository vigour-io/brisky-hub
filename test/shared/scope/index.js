'use strict'

module.exports = function (protocol, key) {
  describe('scopes', function () {
    require('./property')(protocol, key)
    require('./single')(protocol, key)
    require('./multiple')(protocol, key)
    // require('./upstreams')(protocol, key)
    // require('./connection')(protocol, key)
    // require('./adapters')(protocol, key)
  })
}
