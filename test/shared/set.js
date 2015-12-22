'use strict'

module.exports = function (protocol, key) {
  describe('set', function () {
    var server, receiver
    var Hub = require('../../lib')
    var Observable = require('vigour-js/lib/observable')
    var something = new Observable({ bla: true })
    var Event = require('vigour-js/lib/event')
    var mock = key === 'mock'
    var seperator = require('../../lib/util').seperator

    it('can create multiple hubs', function () {
      server = new Hub({
        key: 'server'
      })
      receiver = new Hub({
        key: 'reciever'
      })
    })

    it('can set the adapater on a', function () {
      server.set({
        adapter: {
          id: 'set_server',
          inject: protocol,
          [key]: {}
        }
      })
      expect(server.adapter.id).to.equal('set_server')
    })

    it('can set the adapater on b', function () {
      receiver.set({
        adapter: {
          id: 'set_reciever',
          inject: protocol,
          [key]: {}
        }
      })
      expect(receiver.adapter.id).to.equal('set_reciever')
    })

    it('can create a server "server"', function () {
      server.adapter.set({
        [key]: {
          server: mock ? 'set_server' : 6001
        }
      })
    })

    it('receiver can connect to server', function (done) {
      receiver.adapter.set({ [key]: mock ? 'set_server' : 'ws://localhost:6001' })
      // maybe make this a bit easier to access e.g. protocol will get a connected observable
      receiver.adapter[key].client.origin.connection.origin.on('connect', done)
    })

    it('receiver can send data to server', function (done) {
      server.once(function () {
        expect(server).to.have.property('somefield')
        .which.has.property('_input').equals(true)
        done()
      })
      receiver.set({
        somefield: true
      })
    })

    it('server can send data to receiver', function (done) {
      // subscribe
      // make a subscribe once
      receiver.once(function () {
        expect(receiver).to.have.property('anotherfield')
          .which.has.property('_input').equals(true)
        done()
      })
      server.set({
        anotherfield: true
      })
    })

    it('server can send referenced data to receiver', function (done) {
      receiver.once(function () {
        expect(receiver).to.have.property('a')
        expect(receiver).to.have.property('referenced')
          .which.has.property('_input')
          .which.equals(receiver.a)
        done()
      })
      server.set({ a: true }, false)
      server.set({ referenced: server.a })
    })

    it('receiver can send referenced data to server', function (done) {
      server.once(function () {
        expect(server).to.have.property('field')
          .which.has.property('_input')
          .which.equals(server.referenced)
        done()
      })
      receiver.set({ field: receiver.referenced })
    })

    it('server can send referenced data to receiver, changing a reference', function (done) {
      receiver.field.once(function () {
        expect(this).to.have.property('_input')
          .which.equals(receiver.a)
        done()
      })
      server.set({ field: server.a })
    })

    it('server can send out of adapter scope references to receiver', function (done) {
      receiver.once(function () {
        expect(receiver).to.have.property('something')
          .which.has.property('bla')
          .which.has.property('_input').which.equals(true)
        done()
      })
      server.set({ something: something })
    })

    it('server can send out of adapter scope references to receiver, updates from the references value', function (done) {
      receiver.something.once(function () {
        expect(receiver.something).to.have.property('otherfield')
        done()
      })
      something.set({ otherfield: true })
    })

    it('receiver can send custom stamps over the server to another receiver', function (done) {
      var receiver2 = new Hub({
        adapter: {
          id: 'set_reciever2',
          inject: protocol
        }
      })

      receiver2.adapter.set({
        [key]: mock ? 'set_server' : 'ws://localhost:6001'
      })

      receiver2.adapter[key].once('connect', function () {
        var event = new Event(receiver, 'data', 'danillo')
        receiver2.once(function (data, event) {
          expect(event.stamp.split(seperator)[1]).equal('danillo')
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
}
