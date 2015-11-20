'use strict'
describe('client', function () {
  var Hub = require('../../lib')
  var Mock = require('../../lib/protocol/mock')
  var server = new Hub({
    key: 'server_client',
    adapter: {
      id: 'server_client',
      mock: new Mock()
    }
  })
  var receiver = new Hub({
    key: 'receiver_client',
    adapter: {
      id: 'receiver_client',
      mock: new Mock()
    }
  })
  var receiver2 = new Hub({
    key: 'receiver_client_2',
    adapter: {
      id: 'receiver_client_2',
      mock: new Mock()
    }
  })
  server.set({
    adapter: {
      mock: {
        server: 'server_client'
      }
    }
  })

  it('receiver can connect to server', function (done) {
    receiver.adapter.mock.once('connect', function () {
      done()
    })
    receiver.set({
      adapter: {
        mock: 'server_client'
      }
    })
  })

  it('receiver2 can connect to server', function (done) {
    receiver2.adapter.mock.once('connect', function () {
      done()
    })
    receiver2.set({
      adapter: {
        mock: 'server_client'
      }
    })
  })

  it('reciever has correct client meta data about receiver2', function () {
    expect(receiver)
      .to.have.property('clients')
      .which.has.property('receiver_client_2')
      .which.has.property('browser')
  })
})
