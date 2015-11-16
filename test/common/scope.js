'use strict'

describe('scopes', function () {
  var Hub = require('../../lib')
  var Mock = require('../../lib/protocol/mock')
  var server = new Hub({
    key: 'server'
  })
  var getScope = Hub.prototype.getScope
  var receiver = new Hub({
    key: 'receiver'
  })

  server.set({
    adapter: {
      id: 'server',
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
  server.adapter.mock.set({ server: 'server' })

  receiver.set({
    adapter: {
      id: 'receiver',
      mock: new Mock()
    }
  })

  it('can connect to a scope', function (done) {
    // this is correct so you have one scope per multiple protocols (if its on one level!)
    receiver.adapter.set({
      mock: 'server',
      scope: 'myScope'
    })
    receiver.adapter.mock.on('connect', function () {
      expect(server).to.have.property('_scopes')
        .which.has.property('myScope')
      done()
    })
    global.server = server
  })

  xit('merges sets from the original sever to client', function () {
    server.set({
      youri: true
    })
    expect(receiver.youri.val).to.equal(true)
  })

  xit('merges sets from the "myScope" on the sever to client', function () {
    server._scopes.myScope.set({
      james: true
    })
    expect(receiver.james.val).to.equal(true)
  })
})
