'use strict'

module.exports = function (protocol, key) {
  describe('client', function () {
    var Hub = require('../../lib')
    var server, receiver, receiver2

    it('can create a server and clients', function () {
      server = new Hub({
        key: 'server_client',
        adapter: {
          id: 'server_client',
          inject: protocol
        }
      })
      receiver = new Hub({
        key: 'receiver_client',
        adapter: {
          id: 'receiver_client',
          inject: protocol,
          [key]: {}
        }
      })
      receiver2 = new Hub({
        key: 'receiver_client_2',
        adapter: {
          id: 'receiver_client_2',
          inject: protocol,
          [key]: {}
        }
      })
      server.set({
        adapter: {
          [key]: {
            server: key === 'mock' ? 'server_client' : 6001
          }
        }
      })
    })

    it('receiver can connect to server', function (done) {
      receiver.adapter[key].once('connect', function () {
        server.get('clients', {}).once(function () {
          expect(server)
            .to.have.property('clients')
            .which.has.property('receiver_client')
            .which.has.property('platform')
        })
        done()
      })
      receiver.set({
        adapter: {
          [key]: key === 'mock' ? 'server_client' : 'ws://localhost:6001'
        }
      })
    })

    it('receiver has ip', function (done) {
      receiver.get('clients.receiver_client.ip', {})
        .is((val) => val > 0 || typeof val === 'string')
        .then(() => done())
    })

    it('receiver2 can connect to server', function (done) {
      receiver2.set({
        adapter: {
          [key]: 'server_client'
        }
      })

      receiver2.get('clients.receiver_client_2.platform', {})
        .is((val) => { return typeof val === 'string' })
        .then(() => done())
    })

    xit('reciever2 has ip', function () {
      expect(receiver2)
        .to.have.property('clients')
        .which.has.property('receiver_client_2')
        .which.has.property('ip')
    })

    // sending info back is weird
    xit('reciever has correct client meta data about receiver2', function () {
      expect(receiver)
        .to.have.property('clients')
        .which.has.property('receiver_client_2')
        .which.has.property('platform')
    })
  })
}