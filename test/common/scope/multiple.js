'use strict'

describe('multiple scopes, clients', function () {
  var Hub = require('../../../lib')
  var Mock = require('../../../lib/protocol/mock')
  var server = new Hub({
    key: 'server'
  })
  var getScope = Hub.prototype.getScope
  var scopeReceiver = new Hub({
    key: 'scopeReceiver'
  })
  var receiver = new Hub({
    key: 'receiver'
  })
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
  // check if we can do this immediatly in the adapter when injecting also make sure that protocls are injectab;e
  server.adapter.mock.set({ server: 'multiple_server' })

  receiver.set({
    adapter: {
      id: 'multiple_receiver',
      mock: new Mock()
    }
  })

  it('can connect to a scope', function (done) {
    // this is correct so you have one scope per multiple protocols (if its on one level!)
    receiver.adapter.set({
      mock: 'multiple_server',
      scope: 'myScope'
    })
    receiver.adapter.mock.on('connect', function () {
      expect(server).to.not.have.property('clients')
      expect(server).to.have.property('_scopes')
        .which.has.property('myScope')
      expect(server._scopes.myScope).to.have.property('clients')
      done()
    })
    global.server = server
  })

  it('merges sets from the original sever to client', function () {
    server.set({
      youri: true
    })
    expect(receiver.youri.val).to.equal(true)
  })

  it('merges sets from the "myScope" on the sever to client', function () {
    server._scopes.myScope.set({
      james: true
    })
    expect(receiver.james.val).to.equal(true)
  })

  it('set from client to server only manipulates "myScope"', function () {
    receiver.set({bla: 'hey'})
    expect(server.bla).to.be.not.ok
    expect(server._scopes.myScope.bla).to.be.ok
  })
})
