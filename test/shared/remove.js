'use strict'

module.exports = function (protocol, key) {
  describe('remove', function () {
    var server, receiver, receiver2 //eslint-disable-line
    var Promise = require('bluebird')
    var util = require('./util')
    var setup

    it('can create and connect to multiple hubs', function (done) {
      setup = util.setup({
        protocol: protocol,
        key: key,
        receivers: 2,
        log: true
      })
      server = setup.server
      receiver = setup[1]
      receiver2 = setup[2]
      setup.connected.done(function () {
        done()
      })
    })


  })
}
