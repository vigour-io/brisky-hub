'use strict'

module.exports = function (protocol, key) {
  describe('multiple adapters, multiple scopes', function () {
    var Hub = require('../../../lib')
    var serverA, serverB, receiver

    it('create servers', function () {
      serverA = new Hub({
        adapter: {
          id: 'm_scope_a',
          inject: protocol
        }
      })

      serverB = new Hub({
        adapter: {
          id: 'm_scope_b',
          inject: protocol
        }
      })

      serverA.adapter.set({
        [key]: {
          server: key === 'mock' ? 'm_scope_a' : 6001
        }
      })

      serverB.adapter.set({
        [key]: {
          server: key === 'mock' ? 'm_scope_b' : 6002
        }
      })

      receiver = new Hub({
        a: {
          adapter: {
            id: 'm_scope_receiver_a',
            inject: protocol,
            [key]: {},
            scope: 'james'
          }
        },
        b: {
          adapter: {
            id: 'm_scope_receiver_b',
            inject: protocol,
            [key]: {},
            scope: 'youzi'
          }
        }
      })
    })

    it('receiver a and b can connect to servers', function (done) {
      receiver.a.adapter[key].val = key === 'mock' ? 'm_scope_a' : 'ws://localhost:6001'
      receiver.a.adapter[key].once('connect', function () {
        receiver.b.adapter[key].val = key === 'mock' ? 'm_scope_b' : 'ws://localhost:6002'
        receiver.b.adapter[key].once('connect', function () {
          done()
        })
      })
    })

    it('serverA has james scope', function () {
      expect(serverA._scopes).to.have.property('james')
        .which.has.property('clients')
        .which.has.property('m_scope_receiver_a')
    })

    it('serverB has youzi scope', function () {
      expect(serverB._scopes).to.have.property('youzi')
        .which.has.property('clients')
        .which.has.property('m_scope_receiver_b')
    })
  })
}
