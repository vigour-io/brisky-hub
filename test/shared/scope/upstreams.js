'use strict'
var Promise = require('bluebird')

module.exports = function (protocol, key) {
  describe('multiple upstreams, multiple scopes', function () {
    var Hub = require('../../../lib')
    var getScope = Hub.prototype.getScope
    var a, b, c, scopeReceiver, receiver

    it('can create 3 servers and multiple receivers', function () {
      // make this preparation code reusable
      a = new Hub({ key: 'server_a' })
      b = new Hub({ key: 'server_b' })
      c = new Hub({ key: 'server_c' })
      scopeReceiver = new Hub({ key: 'scopeReceiver' })
      receiver = new Hub({ key: 'receiver' })

      // server preparation
      a.set({
        adapter: {
          id: 'scope_upstreams_server_a',
          inject: protocol,
          [key]: {
            server: key === 'mock' ? 'scope_upstreams_server_a' : 6001
          }
        }
      })

      b.set({
        adapter: {
          id: 'scope_upstreams_server_b',
          inject: protocol,
          [key]: {
            server: key === 'mock' ? 'scope_upstreams_server_b' : 6002
          }
        }
      })

      c.set({
        adapter: {
          id: 'scope_upstreams_server_c',
          inject: protocol,
          [key]: {
            server: key === 'mock' ? 'scope_upstreams_server_c' : 6003
          }
        }
      })

      // recievers
      receiver.set({
        adapter: {
          id: 'scope_upstreams_receiver_(a)',
          inject: protocol,
          [key]: {}
        }
      })

      scopeReceiver.set({
        adapter: {
          id: 'scope_upstreams_receiver_scope_(b)',
          inject: protocol,
          [key]: {}
        }
      })
    })

    it('server c can connect to a', function (done) {
      c.adapter[key].once('connect', function () {
        done()
      })
      c.adapter[key].val = key === 'mock' ? 'scope_upstreams_server_a' : 'ws://localhost:6001'
    })

    it('non-scope reciever can connect to c', function (done) {
      receiver.adapter[key].once('connect', function () {
        done()
      })
      receiver.adapter[key].val = key === 'mock' ? 'scope_upstreams_server_c' : 'ws://localhost:6003'
    })

    it('scope "b" receiver can connect to c, retrieves upstream b', function (done) {
      var connectedToScopeC
      c.define({
        getScope (val, event) {
          var scope = getScope.apply(this, arguments)
          if (val === 'b') {
            scope.set({
              key: 'b_scope',
              adapter: { [key]: key === 'mock' ? 'scope_upstreams_server_b' : 'ws://localhost:6002' }
            })
            scope.adapter[key].once('connect', function () {
              expect(connectedToScopeC).ok
              done()
            })
          }
          return scope
        }
      })
      scopeReceiver.adapter.set({
        [key]: key === 'mock' ? 'scope_upstreams_server_c' : 'ws://localhost:6003',
        scope: 'b'
      })
      scopeReceiver.adapter[key].once('connect', function () {
        connectedToScopeC = true
      })
    })

    it('both receivers receive updates from a', function (done) {
      receiver.subscribe({
        hello: true,
        bye: true
      })

      scopeReceiver.subscribe({
        hello: true,
        bye: true
      })

      Promise.all([
        receiver.get('hello', {}).is(true),
        scopeReceiver.get('hello', {}).is(true)
      ]).then(() => done())

      a.set({ hello: true })
    })

    it('only scopeReceiver receives updates from b', function (done) {
      b.set({ bye: true })
      scopeReceiver.get('bye', {}).is(true, () => {
        expect(receiver).to.not.have.property('bye')
        done()
      })
    })
  })
}
