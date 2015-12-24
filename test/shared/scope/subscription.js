'use strict'

module.exports = function (protocol, key) {
  var Hub = require('../../../lib')
  describe('subscriptions', function () {
    var serverA, serverB, receiverA, receiverB //eslint-disable-line
    var Promise = require('bluebird')
    var util = require('../util')
    var removed = util.removed

    //server.adapter.set({ [key]: { server: key === 'mock' ? 'scope_multiple_server' : 6001 } })

    it('can create and connect to a multiple upstream setup', function () {
      serverA = new Hub({
        adapter: {
          inject: protocol,
          [key]: { server: key === 'mock' ? 'subscriptions_scope_server_a' : 6001 }
        }
      })
      serverB = new Hub({
        adapter: {
          inject: protocol,
          [key]: { server: key === 'mock' ? 'subscriptions_scope_server_b' : 6002 }
        }
      })
      serverB = new Hub({
        adapter: {
          inject: protocol,
          [key]: { server: key === 'mock' ? 'subscriptions_scope_server_b' : 6002 }
        }
      })
    })
  })
}
