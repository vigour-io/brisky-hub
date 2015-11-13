'use strict'

describe('protocol', function () {
  var Protocol = require('../../../lib/protocol')
  var Connection = require('../../../lib/protocol/connection')
  it('can create a new connection', function () {
    var connection = new Connection() // eslint-disable-line
  })
  it('can create a new protocol', function () {
    var connection = new Protocol() // eslint-disable-line
  })
})

describe('hubs', function () {
  var server, client
  var Hub = require('../../../lib')
  var Mock = require('../../../lib/protocol/mock')

  it('can create multiple hubs', function () {
    server = new Hub({
      key: 'server'
    })
    client = new Hub({
      key: 'reciever'
    })
  })

  it('can set the adapater using a mock protocol on a', function () {
    server.set({
      adapter: {
        id: 'server',
        mock: new Mock()
      }
    })
    expect(server.adapter.mock).to.be.instanceof(Mock)
    expect(server.adapter.id).to.equal('server')
  })

  it('can set the adapater using a mock protocol on b', function () {
    client.set({
      adapter: {
        id: 'reciever',
        mock: new Mock()
      }
    })
    expect(client.adapter.mock).to.be.instanceof(Mock)
    expect(client.adapter.id).to.equal('reciever')
  })

  it('can create a server "server"', function () {
    server.adapter.set({
      mock: {
        server: 'server'
      }
    })
  })

  it('client can connect to server', function () {
    client.adapter.set({
      mock: 'server'
    })
  })

  it('client can send data to server', function () {
    client.set({
      somefield: true
    })
    expect(server).to.have.property('somefield')
      .which.has.property('_input').equals(true)
  })

  it('server can send data to client', function () {
    console.log('\n\n\n\n-----------------')
    server.set({
      anotherfield: true
    })
    expect(client).to.have.property('anotherfield')
      .which.has.property('_input').equals(true)
  })
})
