'use strict'

describe('protocol', function () {
  var Protocol = require('../../../lib/protocol')
  var Connection = require('../../../lib/protocol/connection')
  it('can create a new connection', function () {
    var connection = new Connection() // eslint-disable-line
  })
  it('can create a new protocol', function () {
    var connection = new Protocol() // eslint-disable-line
  })
})

describe('hubs', function () {
  var a, b // eslint-disable-line
  var Hub = require('../../../lib')
  var Mock = require('../../../lib/protocol/mock')
  it('can create multiple hubs', function () {
    a = new Hub({
      key: 'a'
    })
    b = new Hub({
      key: 'b'
    })
  })

  it('can set the adapater using a mock protocol on a', function () {
    a.set({
      adapter: {
        id: 'a',
        mock: new Mock()
      }
    })
    expect(a.adapter.mock).to.be.instanceof(Mock)
    expect(a.adapter.id).to.equal('a')
  })

  it('can set the adapater using a mock protocol on b', function () {
    b.set({
      adapter: {
        id: 'b',
        mock: new Mock()
      }
    })
    expect(b.adapter.mock).to.be.instanceof(Mock)
    expect(b.adapter.id).to.equal('b')
  })

  it('can create a server "mockA"', function () {
    a.adapter.set({
      mock: {
        server: 'mockA'
      }
    })
  })

  it('b can connect to mockA', function () {
    a.adapter.set({
      mock: 'mockA'
    })
  })
})
