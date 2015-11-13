'use strict'
describe('set', function () {
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

  it('client can connect to server', function (done) {
    client.adapter.set({ mock: 'server' })
    // maybe make this a bit easier to access e.g. protocol will get a connected observable
    client.adapter.mock.client.origin.connection.origin.on('connect', done)
  })

  it('client can send data to server', function () {
    console.clear()
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
