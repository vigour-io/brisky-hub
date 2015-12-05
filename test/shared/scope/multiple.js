'use strict'

module.exports = function (protocol, key) {
  describe('multiple scopes, clients', function () {
    var Hub = require('../../../lib')
    var server, receiver, scopeReceiver
    it('can create a server, receiver and scopeReceiver', function () {
      server = new Hub({
        key: 'server'
      })
      scopeReceiver = new Hub({ key: 'scopeReceiver' })
      receiver = new Hub({ key: 'receiver' })
      server.set({
        adapter: {
          id: 'scope_multiple_server',
          inject: protocol
        }
      })

      server.adapter.set({ [key]: { server: key === 'mock' ? 'scope_multiple_server' : 6001 } })

      receiver.set({
        adapter: {
          id: 'scope_multiple_receiver',
          inject: protocol
        }
      })

      scopeReceiver.set({
        adapter: {
          id: 'scope_multiple_scope_receiver',
          inject: protocol
        }
      })
    })

    it('connects to the non-scoped data set of server', function (done) {
      receiver.adapter.set({
        [key]: key === 'mock' ? 'scope_multiple_server' : 'ws://localhost:6001'
      })
      receiver.adapter[key].on('connect', function () {
        setTimeout(() => {
          expect(server).to.have.property('clients')
          done()
        })
      })
    })

    it('other client connects to the "myScope" data set of server', function (done) {
      scopeReceiver.adapter.set({
        [key]: key === 'mock' ? 'scope_multiple_server' : 'ws://localhost:6001',
        scope: 'myScope'
      })
      scopeReceiver.adapter[key].on('connect', function () {
        server.once('new', () => setTimeout(() => {
          expect(server).to.have.property('clients')
          expect(server).to.have.property('_scopes')
            .which.has.property('myScope')
          done()
        }))
      })
    })

    it('clients field is not inherited over scopes', function () {
      expect(server.clients).to.not.have.property('scope_multiple_scope_receiver')
      expect(server._scopes.myScope.clients).to.have.property('scope_multiple_scope_receiver')
      expect(server._scopes.myScope.clients).to.not.have.property('scope_multiple_receiver')
    })
  })
}
