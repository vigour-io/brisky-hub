'use strict'

describe('multiple upstreams, multiple scopes', function () {
  var Hub = require('../../../lib')
  var getScope = Hub.prototype.getScope
  var Mock = require('../../../lib/protocol/mock')
  var a = new Hub({ key: 'server_a' })
  var b = new Hub({ key: 'server_b' })

  var c = new Hub({
    key: 'server_c'
  })
  var scopeReceiver = new Hub({ key: 'scopeReceiver' })
  var receiver = new Hub({ key: 'receiver' })

  // server preparation
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
  c.adapter.mock.set({ server: 'scope_upstreams_server_c' })

  // recievers
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

  it('server c can connect to a', function (done) {
    c.adapter.mock.once('connect', function () {
      done()
    })
    c.adapter.mock.val = 'scope_upstreams_server_a'
  })

  it('non-scope reciever can connect to c', function (done) {
    receiver.adapter.mock.once('connect', function () {
      done()
    })
    receiver.adapter.mock.val = 'scope_upstreams_server_c'
  })

  it('scope "b" reciever can connect to c, retrieves upstream b', function (done) {
    c.define({
      getScope (val, event) {
        var scope = getScope.apply(this, arguments)
        if (val === 'b') {
          scope.set({
            adapter: {
              mock: 'scope_upstreams_server_b'
            }
          })
        }
        return scope
      }
    })
    scopeReceiver.adapter.set({
      scope: 'b',
      mock: 'scope_upstreams_server_c'
    })
    scopeReceiver.adapter.mock.once('connect', function () {
      done()
    })
  })
})
