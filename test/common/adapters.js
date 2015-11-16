'use strict'
// make mock injectable, and create new thing by default (can never not be new)
describe('scopes', function () {
  var Hub = require('../../lib')
  var Mock = require('../../lib/protocol/mock')
  var server = global.server = new Hub({
    key: 'server'
  })
  var server2 = global.server2 = new Hub({
    key: 'server2'
  })
  var reciever = new Hub({
    key: 'reciever'
  })
  server.set({
    adapter: {
      id: 'server',
      mock: new Mock()
    }
  })
  server2.set({
    adapter: {
      id: 'server2',
      mock: new Mock()
    }
  })
  reciever.set({
    adapter: {
      id: 'reciever',
      mock: new Mock()
    }
  })
  it('can connect', function () {
      reciever.adapter.set({
        mock: 'server',
      })
  })
})
