'use strict'
require('colors-browserify')
// make mock injectable, and create new thing by default (can never not be new)
describe('multiple adapters', function () {
  var Hub = require('../../lib')
  var Mock = require('../../lib/protocol/mock')

  var a = new Hub({
    key: 'a'
  })

  var b = new Hub({
    key: 'b'
  })

  var reciever = new Hub({
    key: 'reciever',
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
    reciever.set({
      a: {
        adapter: {
          id: 'recieverA',
          mock: new Mock()
        }
      },
      b: {
        adapter: {
          id: 'recieverB',
          mock: new Mock()
        }
      }
    })
    var connected = []
    reciever.a.adapter.mock.on('connect', function () {
      connected.push('a')
    })
    reciever.b.adapter.mock.on('connect', function () {
      connected.push('b')
      expect(connected).to.deep.equal(['a', 'b'])
      done()
    })
    reciever.a.adapter.mock.val = 'a'
    reciever.b.adapter.mock.val = 'b'
  })

  it('it recieves data from a', function () {
    global.a = a
    global.r = reciever
    // console.clear()
    a.set({ somefield: true })
    expect(reciever.a).to.have.property('somefield').which.equals(true)
  })
})
