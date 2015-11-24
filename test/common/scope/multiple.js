'use strict'

describe('multiple scopes, clients', function () {
  var Hub = require('../../../lib')
  var mock = require('../../../lib/protocol/mock')
  var server = new Hub({
    key: 'server'
  })
  var scopeReceiver = new Hub({ key: 'scopeReceiver' })
  var receiver = new Hub({ key: 'receiver' })
  server.set({
    adapter: {
      id: 'scope_multiple_server',
      inject: mock
    }
  })

  server.adapter.set({ mock: { server: 'scope_multiple_server' } })

  receiver.set({
    adapter: {
      id: 'scope_multiple_receiver',
      inject: mock
    }
  })

  scopeReceiver.set({
    adapter: {
      id: 'scope_multiple_scope_receiver',
      inject: mock
    }
  })

  it('connects to the non-scoped data set of server', function (done) {
    receiver.adapter.set({
      mock: 'scope_multiple_server'
    })
    receiver.adapter.mock.on('connect', function () {
      expect(server).to.have.property('clients')
      done()
    })
  })

  it('other client connects to the "myScope" data set of server', function (done) {
    scopeReceiver.adapter.set({
      mock: 'scope_multiple_server',
      scope: 'myScope'
    })
    scopeReceiver.adapter.mock.on('connect', function () {
      expect(server).to.have.property('clients')
      expect(server).to.have.property('_scopes')
        .which.has.property('myScope')
      done()
    })
  })

  it('clients field is not inherited over scopes', function () {
    expect(server.clients).to.not.have.property('scope_multiple_scope_receiver')
    expect(server._scopes.myScope.clients).to.have.property('scope_multiple_scope_receiver')
    expect(server._scopes.myScope.clients).to.not.have.property('scope_multiple_receiver')
  })
})
