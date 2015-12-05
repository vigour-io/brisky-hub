'use strict'

module.exports = function (protocol, key) {
  describe('clients', function () {
    var Hub = require('../../../lib')
    var server, receiver, receiver2

    it('can create a server and 2 clients', function () {
      server = new Hub({
        key: 'clients_s_server'
      })

      receiver = new Hub({
        key: 'clients_s_receiver'
      })

      receiver2 = new Hub({
        key: 'clients_s_receiver2'
      })

      server.set({
        adapter: {
          id: 'clients_s_server',
          inject: protocol,
          [key]: {
            server: key === 'mock' ? 'clients_s_server' : 6001
          }
        }
      })

      receiver.set({
        adapter: {
          id: 'clients_s_receiver',
          inject: protocol,
          [key]: {}
        }
      })

      receiver2.set({
        adapter: {
          id: 'clients_s_receiver2',
          inject: protocol,
          [key]: {}
        }
      })
    })

    it('can connect to the server', function (done) {
      receiver.adapter.set({
        [key]: key === 'mock' ? 'clients_s_server' : 'ws://localhost:6001'
      })
      receiver.adapter[key].once('connect', function () {
        done()
      })
    })

    it('can make a reference to a client', function (done) {
      receiver.set({
        focus: receiver.clients.clients_s_receiver
      })
      server.get('focus', {}).is('clients_s_receiver').then(() => done())
    })

    it('other client connects recieves updates about other clients', function (done) {
      receiver2.adapter.set({
        [key]: key === 'mock' ? 'clients_s_server' : 'ws://localhost:6001'
      })
      receiver2.adapter[key].once('connect', function () {
        receiver.clients.clients_s_receiver.set({ x: true })
        receiver2.get('clients.clients_s_receiver.x', {}).is(true).then(() => done())
      })
    })
  })
}
