'use strict'

describe('multiple adapters, multiple scopes', function () {
  var Hub = require('../../../lib')
  var Mock = require('../../../lib/protocol/mock')

  var serverA = new Hub({
    adapter: {
      id: 'm_scope_a',
      mock: new Mock()
    }
  })

  var serverB = new Hub({
    adapter: {
      id: 'm_scope_b',
      mock: new Mock()
    }
  })

  var receiver = new Hub({
    a: {
      adapter: {
        id: 'm_scope_receiver_a',
        mock: new Mock()
      }
    },
    b: {
      adapter: {
        id: 'm_scope_receiver_b',
        mock: new Mock()
      }
    }
  })

  it('receiver a and b can connect to servers', function () {

  })
})
