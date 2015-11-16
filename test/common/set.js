'use strict'

describe('set', function () {
  var server, reciever
  var Hub = require('../../lib')
  var Mock = require('../../lib/protocol/mock')

  it('can create multiple hubs', function () {
    server = new Hub({
      key: 'server'
    })
    reciever = new Hub({
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
    reciever.set({
      adapter: {
        id: 'reciever',
        mock: new Mock()
      }
    })
    expect(reciever.adapter.mock).to.be.instanceof(Mock)
    expect(reciever.adapter.id).to.equal('reciever')
  })

  it('can create a server "server"', function () {
    server.adapter.set({
      mock: {
        server: 'server'
      }
    })
  })

  it('reciever can connect to server', function (done) {
    reciever.adapter.set({ mock: 'server' })
    // maybe make this a bit easier to access e.g. protocol will get a connected observable
    reciever.adapter.mock.client.origin.connection.origin.on('connect', done)
  })

  it('reciever can send data to server', function () {
    console.clear()
    reciever.set({
      somefield: true
    })
    expect(server).to.have.property('somefield')
    .which.has.property('_input').equals(true)
  })

  it('server can send data to reciever', function () {
    console.log('\n\n\n\n-----------------')
    server.set({
      anotherfield: true
    })
    expect(reciever).to.have.property('anotherfield')
      .which.has.property('_input').equals(true)
  })
})
