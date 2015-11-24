'use strict'

describe('reconnect', function () {
  var a, b, receiver
  var Hub = require('../../lib')
  var mock = require('../../lib/protocol/mock')

  it('can create multiple hubs', function () {
    a = new Hub({
      key: 'server_reconnect_a',
      adapter: {
        id: 'server_reconnect_a',
        inject: mock
      }
    })
    b = new Hub({
      key: 'server_reconnect_b',
      adapter: {
        id: 'server_reconnect_b',
        inject: mock
      }
    })
    receiver = new Hub({
      key: 'receiver_reconnect',
      adapter: {
        id: 'receiver_reconnect',
        inject: mock,
        mock: {}
      }
    })
    a.adapter.set({ mock: { server: 'server_reconnect_a' } })
    b.adapter.set({ mock: { server: 'server_reconnect_b' } })
  })

  it('can connect to server_a', function (done) {
    receiver.adapter.mock.val = 'server_reconnect_a'
    receiver.adapter.mock.once('connect', function () {
      expect(a.clients).to.have.property('receiver_reconnect')
      done()
    })
  })

  it('connected should be true', function () {
    expect(receiver.adapter.mock.connected.val).to.equal(true)
  })

  it('can connect to another server server_b', function (done) {
    receiver.adapter.mock.val = 'server_reconnect_b'
    receiver.adapter.mock.once('connect', function () {
      expect(b.clients).to.have.property('receiver_reconnect').which.is.ok
      expect(a.clients['receiver_reconnect']).to.not.be.ok
      done()
    })
  })

  it('can connect to another server server_a', function (done) {
    receiver.adapter.mock.val = 'server_reconnect_a'
    receiver.adapter.mock.once('connect', function () {
      expect(a.clients).to.have.property('receiver_reconnect').which.is.ok
      expect(b.clients['receiver_reconnect']).to.not.be.ok
      done()
    })
  })

  it('server connections gets removed, client reconnects after 1 attempt', function (done) {
    // nested callbacks to test order
    receiver.adapter.mock.once('close', function () {
      expect(receiver.adapter.mock.connected.val).to.equal(false)
      this.once('reconnect', function () {
        this.once('connect', done)
      })
    })
    a.clients['receiver_reconnect'].connection.origin.remove()
  })
})
