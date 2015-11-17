'use strict'
describe('multiple upstreams, multiple scopes, multiple clients over single connection', function () {
  var Hub = require('../../../lib')
  var Mock = require('../../../lib/protocol/mock')
  var getScope = Hub.prototype.getScope
  // servers
  var a = new Hub({ key: 'server_a' })
  // set scope handler
  var b = new Hub({
    key: 'server_b',
    define: {
      getScope (val, event) {
        var scope = getScope.apply(this, arguments)
        scope.set({
          adapter: {
            mock: 'scope_connection_server_a',
            scope: val
          }
        })
        console.log('ok now were doing it! -- multi upstream scopes -- share connection', val)
        return scope
      }
    }
  })

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
  var receiverA1 = new Hub({ key: 'receiverA1' })
  var receiverA2 = new Hub({ key: 'receiverA2' })

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

  it('receiverA1 can connect to b, b._scopes.A1 gets connected to a', function (done) {
    receiverA1.adapter.mock.val = 'scope_connection_server_b'
    receiverA1.adapter.mock.once('connect', function () {
      done()
    })
  })
})
