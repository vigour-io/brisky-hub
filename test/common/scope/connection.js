'use strict'

describe('multiple upstreams, multiple scopes, multiple clients over single connection', function () {
  var Hub = require('../../../lib')
  // var getScope = Hub.prototype.getScope
  var Mock = require('../../../lib/protocol/mock')
  var a = new Hub({ key: 'server_b' })
  var b = new Hub({ key: 'server_c' })
  var receiverA1 = new Hub({ key: 'receiverA1' })
  var receiverA2 = new Hub({ key: 'receiverA2' })
  // server preparation
  a.set({
    adapter: {
      id: 'scope_connection_server_a',
      mock: new Mock()
    }
  })

  b.set({
    adapter: {
      id: 'scope_connection_server_b',
      mock: new Mock()
    }
  })

  a.adapter.mock.set({ server: 'scope_connection_server_a' })
  b.adapter.mock.set({ server: 'scope_connection_server_b' })

  // recievers
  receiverA1.set({
    adapter: {
      id: 'scope_connection_receiver_A1',
      mock: new Mock()
    }
  })

  receiverA2.set({
    adapter: {
      id: 'scope_connection_receiver_A2',
      mock: new Mock()
    }
  })
})
