'use strict'
module.exports = function (protocol, key) {
  describe('multiple adapters', function () {
    var Hub = require('../../lib')
    var a, b, receiver

    it('can create hubs with multiple adapters', function () {
      a = new Hub({
        key: 'a'
      })

      b = new Hub({
        key: 'b'
      })

      receiver = new Hub({
        key: 'receiver',
        a: {},
        b: {}
      })

      a.set({
        adapter: {
          id: 'a',
          inject: protocol
        }
      })

      b.set({
        adapter: {
          id: 'b', // need more id!
          inject: protocol
        }
      })
    })

    it('can create 2 servers', function () {
      a.adapter.set({ [key]: { server: key === 'mock' ? 'a' : 6001 } })
      b.adapter.set({ [key]: { server: key === 'mock' ? 'b' : 6002 } })
    })

    it('can connect to 2 servers (a and b)', function (done) {
      receiver.set({
        a: {
          adapter: {
            id: 'receiverA',
            inject: protocol,
            [key]: {}
          }
        },
        b: {
          adapter: {
            id: 'receiverB',
            inject: protocol,
            [key]: {}
          }
        }
      })
      var connected = []
      receiver.a.adapter[key].on('connect', function () {
        connected.push('a')
      })
      receiver.b.adapter[key].on('connect', function () {
        connected.push('b')
        expect(connected).to.deep.equal(['a', 'b'])
        done()
      })
      receiver.a.adapter[key].val = key === 'mock' ? 'a' : 'ws://localhost:6001'
      receiver.b.adapter[key].val = key === 'mock' ? 'b' : 'ws://localhost:6002'
    })

    it('it recieves data from a', function (done) {
      a.set({ somefield: true })
      receiver.a.once(() => {
        expect(receiver.a)
          .to.have.property('somefield')
          .which.has.property('_input').equals(true)
        done()
      })
    })
  })
}
