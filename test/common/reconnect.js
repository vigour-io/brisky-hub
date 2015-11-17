'use strict'

describe('reconnect', function () {
  var a, b, receiver
  var Hub = require('../../lib')
  var Mock = require('../../lib/protocol/mock')

  it('can create multiple hubs', function () {
    a = new Hub({
      key: 'server-reconnect-a',
      adapter: {
        id: 'server-reconnect-a',
        mock: new Mock()
      }
    })
    b = new Hub({
      key: 'server-reconnect-b',
      adapter: {
        id: 'server-reconnect-b',
        mock: new Mock()
      }
    })
    receiver = new Hub({
      key: 'receiver-reconnect',
      adapter: {
        id: 'receiver-reconnect',
        mock: new Mock()
      }
    })
    a.adapter.mock.set({ server: 'server-reconnect-a' })
    b.adapter.mock.set({ server: 'server-reconnect-b' })
  })

  it('can connect to server-a', function (done) {
    receiver.adapter.mock.val = 'server-reconnect-a'
    receiver.adapter.mock.once('connect', function () {
      expect(a.clients).to.have.property('receiver-reconnect')
      done()
    })
  })

  it('can connect to another server server-b', function (done) {
    receiver.adapter.mock.val = 'server-reconnect-b'
    receiver.adapter.mock.once('connect', function () {
      expect(b.clients).to.have.property('receiver-reconnect').which.is.ok
      expect(a.clients['receiver-reconnect']).to.not.be.ok
      done()
    })
  })

  it('can connect to another server server-a', function (done) {
    receiver.adapter.mock.val = 'server-reconnect-a'
    receiver.adapter.mock.once('connect', function () {
      expect(a.clients).to.have.property('receiver-reconnect').which.is.ok
      expect(b.clients['receiver-reconnect']).to.not.be.ok
      done()
    })
  })

  it('server gets removed, client disconnects', function (done) {
    receiver.adapter.mock.once('close', function () {
      done()
    })
    a.clients['receiver-reconnect'].connection.origin.remove()
  })
})
