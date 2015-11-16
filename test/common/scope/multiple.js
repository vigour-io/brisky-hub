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

  it('connects to the non-scoped data set of server', function (done) {
    receiver.adapter.set({
      mock: 'multiple_server'
    })
    receiver.adapter.mock.on('connect', function () {
      expect(server).to.have.property('clients')
      done()
    })
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
})
