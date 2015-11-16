'use strict'

describe('multiple scopes, clients', function () {
  var Hub = require('../../../lib')
  var Mock = require('../../../lib/protocol/mock')
  var server = new Hub({
    key: 'server'
  })
  var getScope = Hub.prototype.getScope
  var scopeReceiver = new Hub({ key: 'scopeReceiver' })
  var receiver = new Hub({ key: 'receiver' })
  server.set({
    adapter: {
      id: 'multiple_server',
      mock: new Mock()
    },
    define: {
      getScope (scope, event) {
        console.log('get dat scope!', scope)
        console.log('use this to test a double upstream as well')
        return getScope.apply(this, arguments)
      }
    }
  })

  server.adapter.mock.set({ server: 'multiple_server' })

  receiver.set({
    adapter: {
      id: 'multiple_receiver',
      mock: new Mock()
    }
  })

  scopeReceiver.set({
    adapter: {
      id: 'multiple_scope_receiver',
      mock: new Mock()
    }
  })

  it('connects to the non-scoped data set of server', function (done) {
    receiver.adapter.set({
      mock: 'multiple_server'
    })
    receiver.adapter.mock.on('connect', function () {
      expect(server).to.have.property('clients')
      done()
    })
  })

  it('other client connects to the "myScope" data set of server', function (done) {
    console.clear()
    scopeReceiver.adapter.set({
      mock: 'multiple_server',
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
    expect(server.clients).to.not.have.property('multiple_scope_receiver')
    expect(server._scopes.myScope.clients).to.have.property('multiple_scope_receiver')
    expect(server._scopes.myScope.clients).to.not.have.property('multiple_receiver')
  })
})
