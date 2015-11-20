'use strict'
require('colors-browserify')

describe('set', function () {
  var server, receiver
  var Hub = require('../../lib')
  var Mock = require('../../lib/protocol/mock')
  var Observable = require('vigour-js/lib/observable')
  var something = new Observable({ bla: true })

  it('can create multiple hubs', function () {
    server = new Hub({
      key: 'server'
    })
    receiver = new Hub({
      key: 'reciever'
    })
  })

  it('can set the adapater using a mock protocol on a', function () {
    server.set({
      adapter: {
        id: 'set_server',
        mock: new Mock()
      }
    })
    expect(server.adapter.mock).to.be.instanceof(Mock)
    expect(server.adapter.id).to.equal('set_server')
  })

  it('can set the adapater using a mock protocol on b', function () {
    receiver.set({
      adapter: {
        id: 'set_reciever',
        mock: new Mock()
      }
    })
    expect(receiver.adapter.mock).to.be.instanceof(Mock)
    expect(receiver.adapter.id).to.equal('set_reciever')
  })

  it('can create a server "server"', function () {
    server.adapter.set({
      mock: {
        server: 'set_server'
      }
    })
  })

  it('receiver can connect to server', function (done) {
    receiver.adapter.set({ mock: 'set_server' })
    // maybe make this a bit easier to access e.g. protocol will get a connected observable
    receiver.adapter.mock.client.origin.connection.origin.on('connect', done)
  })

  it('receiver can send data to server', function () {
    receiver.set({
      somefield: true
    })
    expect(server).to.have.property('somefield')
    .which.has.property('_input').equals(true)
  })

  it('server can send data to receiver', function () {
    server.set({
      anotherfield: true
    })
    expect(receiver).to.have.property('anotherfield')
      .which.has.property('_input').equals(true)
  })

  it('server can send referenced data to receiver', function () {
    server.set({ a: true }, false)
    server.set({ referenced: server.a })
    expect(receiver).to.have.property('a')
    expect(receiver).to.have.property('referenced')
      .which.has.property('_input')
      .which.equals(receiver.a)
  })

  it('receiver can send referenced data to server', function () {
    receiver.set({ field: receiver.referenced })
    expect(server).to.have.property('field')
      .which.has.property('_input')
      .which.equals(server.referenced)
  })

  it('server can send referenced data to receiver, changing a reference', function () {
    server.set({ field: server.a })
    expect(receiver).to.have.property('field')
      .which.has.property('_input')
      .which.equals(receiver.a)
  })

  it('server can send out of adapter scope references to receiver', function () {
    server.set({ something: something })
    expect(receiver).to.have.property('something')
      .which.has.property('bla')
      .which.has.property('_input').which.equals(true)
  })

  it('server can send out of adapter scope references to receiver, updates from the references value', function () {
    something.set({ otherfield: true })
    expect(receiver.something).to.have.property('otherfield')
  })
})
