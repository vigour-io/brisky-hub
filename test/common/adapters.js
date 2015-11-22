'use strict'

describe('multiple adapters', function () {
  var Hub = require('../../lib')
  var Mock = require('../../lib/protocol/mock')

  var a = new Hub({
    key: 'a'
  })

  var b = new Hub({
    key: 'b'
  })

  var receiver = new Hub({
    key: 'receiver',
    a: {},
    b: {}
  })

  a.set({
    adapter: {
      id: 'a',
      mock: new Mock()
    }
  })

  b.set({
    adapter: {
      id: 'b', // need more id!
      mock: new Mock()
    }
  })

  it('can create 2 servers', function () {
    a.adapter.mock.set({ server: 'a' })
    b.adapter.mock.set({ server: 'b' })
  })

  it('can connect to 2 servers (a and b)', function (done) {
    receiver.set({
      a: {
        adapter: {
          id: 'receiverA',
          mock: new Mock()
        }
      },
      b: {
        adapter: {
          id: 'receiverB',
          mock: new Mock()
        }
      }
    })
    var connected = []
    receiver.a.adapter.mock.on('connect', function () {
      connected.push('a')
    })
    receiver.b.adapter.mock.on('connect', function () {
      connected.push('b')
      expect(connected).to.deep.equal(['a', 'b'])
      done()
    })
    receiver.a.adapter.mock.val = 'a'
    receiver.b.adapter.mock.val = 'b'
  })

  it('it recieves data from a', function () {
    a.set({ somefield: true })
    expect(receiver.a)
      .to.have.property('somefield')
      .which.has.property('_input').equals(true)
  })
})
