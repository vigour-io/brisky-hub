'use strict'

describe('multiple scopes, clients', function () {
  var Hub = require('../../../lib')
  var Mock = require('../../../lib/protocol/mock')
  var a = new Hub({ key: 'server_a' })
  var b = new Hub({ key: 'server_b' })
  var c = new Hub({ key: 'server_c' })
  var scopeReceiver = new Hub({ key: 'scopeReceiver' })
  var receiver = new Hub({ key: 'receiver' })
  a.set({
    adapter: {
      id: 'scope_upstreams_server_a',
      mock: new Mock()
    }
  })

  b.set({
    adapter: {
      id: 'scope_upstreams_server_b',
      mock: new Mock()
    }
  })

  c.set({
    adapter: {
      id: 'scope_upstreams_server_c',
      mock: new Mock()
    }
  })

  a.adapter.mock.set({ server: 'scope_upstreams_server_a' })
  b.adapter.mock.set({ server: 'scope_upstreams_server_b' })

  receiver.set({
    adapter: {
      id: 'scope_upstreams_receiver',
      mock: new Mock()
    }
  })

  scopeReceiver.set({
    adapter: {
      id: 'scope_upstreams_receiver_scope_b',
      mock: new Mock()
    }
  })

})
