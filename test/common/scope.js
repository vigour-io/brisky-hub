'use strict'

describe('scopes', function () {
  var Hub = require('../../lib')
  var Mock = require('../../lib/protocol/mock')
  var server = global.server = new Hub({
    key: 'server'
  })
  var getScope = Hub.getScope
  var reciever = new Hub({
    key: 'reciever'
  })
  server.set({
    adapter: {
      id: 'server',
      mock: new Mock()
    },
    define: {
      getScope () {
        console.log('get dat scopes!', arguments)
        return getScope.apply(this, arguments)
      }
    }
  })
  reciever.set({
    adapter: {
      id: 'reciever',
      mock: new Mock()
    }
  })
  it('can connect to a scope', function () {
      reciever.adapter.set({
        mock: 'server',
        // this is correct so you have one scope per multiple protocols (if its on one level!)
        scope: 'hello'
      })
  })
})