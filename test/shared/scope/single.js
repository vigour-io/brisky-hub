'use strict'

module.exports = function (protocol, key) {
  describe('single scope', function () {
    var Hub = require('../../../lib')
    var server, receiver

    it('can create a server and a client', function () {
      server = new Hub({
        key: 'single_server'
      })

      receiver = new Hub({
        key: 'single_receiver'
      })

      server.set({
        adapter: {
          id: 'single_server',
          inject: protocol,
          [key]: {
            server: key === 'mock' ? 'single_server' : 6001
          }
        }
      })

      receiver.set({
        adapter: {
          id: 'single_receiver',
          inject: protocol,
          [key]: {}
        }
      })
    })

    it('can connect to a scope', function (done) {
      receiver.adapter.set({
        [key]: key === 'mock' ? 'single_server' : 'ws://localhost:6001',
      })
      receiver.subscribe({
        youri: true,
        james: true,
        bla: true,
        randomfield: true
      })

      receiver.adapter.scope.val = 'myScope'

      global.server = server
      global.receiver = receiver
      receiver.adapter[key].once('connect', function () {
        expect(server).to.not.have.property('clients')
        server.once('new', function () {
          setTimeout(() => {
            expect(server).to.have.property('_scopes')
              .which.has.property('myScope')
            expect(server._scopes.myScope).to.have.property('clients')
            expect(server._scopes.myScope).to.have.property('_scope')
              .which.equals('myScope')
            done()
          })
        })
      })
    })

    it('merges sets from the original sever to client', function (done) {
      server.set({ youri: true })
      receiver.get('youri', {}).is(true).then(() => done())
    })

    it('merges sets from the "myScope" on the sever to client', function (done) {
      server._scopes.myScope.set({ james: true })
      receiver.get('james', {}).is(true).then(() => done())
    })

    it('set from client to server only manipulates "myScope"', function (done) {
      receiver.set({bla: 'hey'})
      server._scopes.myScope.get('bla', {}).is('hey').then(() => {
        expect(server.bla).not.ok
        done()
      })
    })

    it('can change scope dynamicly', function (done) {
      console.clear()
      console.log('-----> yo switch it up'.blue)
      server.once('new', () => setTimeout(() => {
        expect(server._scopes).to.have.property('rick')
        done()
      }))
      receiver.set({ adapter: { scope: 'rick' } })
    })

    it('removed client correct, added client to correct scope', function () {
      expect(server._scopes.rick)
        .to.have.property('clients')
        .which.has.property('single_receiver')
      expect(server._scopes.myScope).not.ok
    })

    it('recieves updates on scope "rick"', function (done) {
      server._scopes.rick.set({ james: 'yes' })
      receiver.get('james', {}).is('yes').then(() => done())
    })

    it('recieves updates from non-scoped', function (done) {
      server.set({ randomfield: true })
      receiver.get('randomfield', {}).is(true).then(() => done())
    })

    it('can disconnect and switch scope', function (done) {
      // call close
      server._scopes.rick.clients['single_receiver'].connection.origin.remove()
      receiver.set({
        adapter: {
          scope: 'marcus'
        }
      })
      receiver.adapter[key].once('connect', function () {
        // make scopes observable much nicer
        server.once('new', () => {
          setTimeout(() => {
            expect(server._scopes).to.have.property('marcus')
              .which.has.property('clients')
              .which.has.property('single_receiver')
            expect(server._scopes.rick).not.ok
            done()
          })
        })
      })
    })

    it('can switch from scoped to non-scoped', function (done) {
      receiver.set({
        adapter: {
          scope: false
        }
      })

      server.get('clients.single_receiver', {})
        .is('single_receiver')
        .then(() => done())
    })

    it('can switch from non-scoped to scoped', function () {
      receiver.set({
        adapter: {
          scope: 'nika'
        }
      })
      server.once('new', () => setTimeout(() => {
        expect(server.clients.single_receiver).to.not.ok
        expect(server._scopes).to.have.property('nika')
          .which.has.property('clients')
          .which.has.property('single_receiver')
      }))
    })

    it('can switch from a non-scope new reciever to scoped', function (done) {
      var reciever2 = new Hub({
        adapter: {
          id: 'single_receiver_2',
          inject: protocol,
          [key]: key === 'mock' ? 'single_server' : 'ws://localhost:6001'
        }
      })
      reciever2.adapter[key].once('connect', function () {
        setTimeout(() => {
          expect(server.clients.single_receiver_2).to.ok
          server.once('new', () => setTimeout(() => {
            expect(server.clients.single_receiver_2).to.not.ok
            expect(server._scopes).to.have.property('krystan')
              .which.has.property('clients')
              .which.has.property('single_receiver_2')
            done()
          }))
          reciever2.adapter.set({ scope: 'krystan' })
        }, 100)
      })
    })
  })
}
