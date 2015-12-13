'use strict'

module.exports = function (protocol, key) {
  describe('references', function () {
    var server, receiver, receiver2 //eslint-disable-line
    var Promise = require('bluebird')
    var util = require('./util')

    it('can create and connect to multiple hubs', function (done) {
      var setup = util.setup(protocol, key, 2, true)
      server = setup.server
      receiver = setup[1]
      receiver2 = setup[2]
      setup.connected.then(function () {
        done()
      })
    })

    it('can set a reference on the server', function (done) {
      Promise.all([
        receiver.get('time', {}).is(1),
        receiver2.get('time', {}).is(1),
        receiver.get('list.0.time', {}).is(1),
        receiver2.get('list.0.time', {}).is(1)
      ]).then(function () {
        done()
      })
      server.set({ time: 1 })
      server.set({
        list: { 0: { time: server.time } }
      })
    })

    it('can set reference on the receiver', function (done) {
      Promise.all([
        server.time.is(2),
        server.list[0].time.is(2),
        receiver2.time.is(2),
        receiver2.list[0].time.is(2)
      ]).then(function () {
        done()
      })
      receiver.set({ time: 2 })
    })

    it('can set reference on both receivers', function (done) {
      Promise.all([
        server.list[0].time.is(3),
        receiver.list[0].time.is(3),
        receiver2.list[0].time.is(3)
      ]).then(function () {
        done()
      })
      receiver.set({ time: 3 })
      receiver2.set({ time: 3 })
    })
  })
}
