'use strict'
module.exports = function (protocol, key) {
  describe('reconnect', function () {
    var a, b, receiver
    var Hub = require('../../lib')
    var mock = key === 'mock'

    it('can create multiple hubs', function () {
      a = new Hub({
        key: 'server_reconnect_a',
        adapter: {
          id: 'server_reconnect_a',
          inject: protocol
        }
      })
      b = new Hub({
        key: 'server_reconnect_b',
        adapter: {
          id: 'server_reconnect_b',
          inject: protocol
        }
      })
      receiver = new Hub({
        key: 'receiver_reconnect',
        adapter: {
          id: 'receiver_reconnect',
          inject: protocol,
          [key]: {}
        }
      })
      a.adapter.set({ [key]: { server: mock ? 'server_reconnect_a' : 6002 } })
      b.adapter.set({ [key]: { server: mock ? 'server_reconnect_b' : 6003 } })
    })

    it('can connect to server_a', function (done) {
      receiver.adapter[key].once('connect', function () {
        a.get('clients', {}).once(function () {
          expect(a.clients).to.have.property('receiver_reconnect')
          done()
        })
      })
      receiver.adapter[key].val = mock ? 'server_reconnect_a' : 'ws://localhost:6002'
    })

    it('connected should be true', function () {
      expect(receiver.adapter[key].connected.val).to.equal(true)
    })

    it('can connect to another server server_b', function (done) {
      receiver.adapter[key].once('connect', function () {
        // console.log('ok ok ok ok ok')
        // expect(b.clients).to.have.property('receiver_reconnect').which.is.ok
      })

      b.get('clients', {}).once(function () {
        // console.log('ok ok ok ok ok')
        expect(a.clients['receiver_reconnect']).to.not.be.ok
        done()
      })
      receiver.adapter[key].val = mock ? 'server_reconnect_b' : 'ws://localhost:6003'
    })

    it('can connect to another server server_a', function (done) {
      receiver.adapter[key].once('connect', function () {
        // expect(a.clients).to.have.property('receiver_reconnect').which.is.ok
        // expect(b.clients['return  ;eceiver_reconnect']).to.not.be.ok
        done()
      })
      receiver.adapter[key].val = mock ? 'server_reconnect_a' : 'ws://localhost:6002'
    })

    it('server connections gets removed, client reconnects after 1 attempt', function (done) {
      receiver.adapter[key].once('close', function () {
        expect(receiver.adapter[key].connected.val).to.equal(false)
        this.once('reconnect', function () {
          this.once('connect', done)
        })
      })
      // does not result in a close fire
      // make a protocol .close method or something or disconnect
      // client.disconnect // protocol.disconnect
      a.clients['receiver_reconnect'].connection.origin.remove()
    })
  })
}
