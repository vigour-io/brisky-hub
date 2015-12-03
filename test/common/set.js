'use strict'

describe('set', function () {
  var server, receiver
  var Hub = require('../../lib')
  var mock = require('../../lib/protocol/mock')
  var Mock = require('../../lib/protocol/mock/constructor')
  var Observable = require('vigour-js/lib/observable')
  var something = new Observable({ bla: true })
  var Event = require('vigour-js/lib/event')

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
        inject: mock,
        mock: {}
      }
    })
    expect(server.adapter.mock).to.be.instanceof(Mock)
    expect(server.adapter.id).to.equal('set_server')
  })

  it('can set the adapater using a mock protocol on b', function () {
    receiver.set({
      adapter: {
        id: 'set_reciever',
        inject: mock,
        mock: {}
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

  it('receiver can send custom stamps over the server to another receiver', function (done) {
    var receiver2 = new Hub({
      adapter: {
        id: 'set_reciever2',
        inject: mock
      }
    })

    receiver2.adapter.set({
      mock: 'set_server'
    })

    receiver2.adapter.mock.once('connect', function () {
      var event = new Event(receiver, 'data', 'danillo')
      receiver2.once(function (data, event) {
        expect(event.stamp.split('|')[1]).equal('danillo')
        expect(receiver2).to.have.property('danillo')
        done()
      })
      receiver.set({
        danillo: true
      }, event)
    })
  })

  it('get should not get synced', function () {
    function guard () {
      throw new Error('gets should not fire!')
    }
    receiver.once(guard)
    receiver.get('afield', true)
    receiver.off(guard)
  })
})
