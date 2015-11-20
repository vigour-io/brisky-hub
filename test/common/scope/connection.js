'use strict'
describe('multiple upstreams, multiple scopes, multiple clients over single connection', function () {
  var Hub = require('../../../lib')
  var Mock = require('../../../lib/protocol/mock')
  var getScope = Hub.prototype.getScope
  // servers
  var a = new Hub({ key: 'server_a' })
  var b = new Hub({
    key: 'server_b',
    define: {
      getScope (val, event) {
        var scope = getScope.apply(this, arguments)
        scope.set({
          key: 'server_bSCOPE_' + val,
          adapter: {
            mock: 'scope_connection_server_a',
            scope: val
          }
        })
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
    receiverA1.adapter.set({
      scope: 'a1',
      mock: 'scope_connection_server_b'
    })
    receiverA1.adapter.mock.once('connect', function () {
      setTimeout(done, 50) // once b connects to a
    })
  })

  it('a1 has scope with correct clients object', function () {
    expect(a).to.have.property('_scopes')
      .which.has.property('a1')
      .which.has.property('clients')
      .which.has.property('scope_connection_server_b')
  })

  it('a set a field on scope a1', function () {
    a._scopes.a1.set({
      somefield: true
    })
    expect(receiverA1).to.have.property('somefield')
  })

  it('receiverA2 can connect to b, b._scopes.A2 gets connected to a, shares connection', function (done) {
    receiverA2.adapter.set({
      scope: 'a2',
      mock: 'scope_connection_server_b'
    })
    receiverA2.adapter.mock.once('connect', function () {
      setTimeout(done, 50)
    })
  })

  it('a2 has scope with correct clients object', function () {
    expect(a).to.have.property('_scopes')
      .which.has.property('a2')
      .which.has.property('clients')
      .which.has.property('scope_connection_server_b')
  })

  it('a set a field on scope a2', function () {
    a._scopes.a2.set({
      anotherfield: true
    })
    expect(receiverA2).to.have.property('anotherfield')
    expect(receiverA1).to.not.have.property('anotherfield')
  })
})
