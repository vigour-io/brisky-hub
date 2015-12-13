'use strict'

module.exports = function (protocol, key) {
  describe('references', function () {
    var server, receiver, receiver2 //eslint-disable-line
    var Hub = require('../../lib')
    var mock = key === 'mock'

    it('can create and connect to multiple hubs', function (done) {
      // make this a resuseable function
      server = new Hub({
        key: 'server',
        adapter: {
          id: 'refs_server',
          inject: protocol,
          [key]: {
            server: mock ? 'refs_server' : 6001
          }
        }
      })

      receiver = new Hub({
        key: 'reciever',
        adapter: {
          id: 'client1_refs_server',
          inject: protocol,
          [key]: mock ? 'refs_server' : 'ws://localhost:6001'
        }
      })
      receiver.adapter[key].once('connect', function () {
        if (receiver2.adapter[key].connected.val) {
          done()
        }
      })

      receiver2 = new Hub({
        key: 'reciever2',
        adapter: {
          id: 'client2_refs_server',
          inject: protocol,
          [key]: mock ? 'refs_server' : 'ws://localhost:6001'
        }
      })

      receiver2.adapter[key].once('connect', function () {
        if (receiver.adapter[key].connected.val) {
          done()
        }
      })
    })
  })
}
