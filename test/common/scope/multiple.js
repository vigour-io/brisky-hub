'use strict'

describe('multiple scopes, clients', function () {
  var Hub = require('../../../lib')
  var Mock = require('../../../lib/protocol/mock')
  var server = new Hub({
    key: 'server'
  })
  var scopeReceiver = new Hub({ key: 'scopeReceiver' })
  var receiver = new Hub({ key: 'receiver' })
  server.set({
    adapter: {
      id: 'scope_multiple_server',
      mock: new Mock()
    }
  })

  server.adapter.mock.set({ server: 'scope_multiple_server' })

  receiver.set({
    adapter: {
      id: 'scope_multiple_receiver',
      mock: new Mock()
    }
  })

  scopeReceiver.set({
    adapter: {
      id: 'scope_multiple_scope_receiver',
      mock: new Mock()
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
    console.clear()
    scopeReceiver.adapter.set({
      mock: 'scope_multiple_server',
      scope: 'myScope'
    })
    scopeReceiver.adapter.mock.on('connect', function () {
      expect(server).to.have.property('clients')
      // now make sure that clients are not connected!
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
