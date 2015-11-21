'use strict'
require('colors-browserify')

describe('multiple upstreams, multiple scopes', function () {
  var Hub = require('../../../lib')
  var getScope = Hub.prototype.getScope
  var Mock = require('../../../lib/protocol/mock')
  var a = new Hub({ key: 'server_a' })
  var b = new Hub({ key: 'server_b' })
  var c = new Hub({ key: 'server_c' })
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
    var connectedToScopeC
    c.define({
      getScope (val, event) {
        var scope = getScope.apply(this, arguments)
        if (val === 'b') {
          scope.set({
            key: 'b_scope',
            adapter: { mock: 'scope_upstreams_server_b' }
          })
          scope.adapter.mock.once('connect', function () {
            expect(connectedToScopeC).ok
            done()
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
      connectedToScopeC = true
    })
  })

  it('both receivers receive updates from a', function () {
    a.set({ hello: true })
    expect(receiver).to.have.property('hello')
    expect(scopeReceiver).to.have.property('hello')
  })

  it('only scopeReceiver receives updates from b', function () {
    b.set({ bye: true })
    expect(receiver).to.not.have.property('bye')
    expect(scopeReceiver).to.have.property('bye')
  })
})
