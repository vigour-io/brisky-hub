'use strict'
module.exports = function (protocol, key) {
  describe('multiple upstreams, multiple scopes, multiple clients over single connection', function () {
    var Hub = require('../../../lib')
    var getScope = Hub.prototype.getScope
    var a, b, receiverA1, receiverA2
    // servers
    it('can create 2 servers and 2 receivers', function () {
      a = new Hub({ key: 'server_a' })
      b = new Hub({
        key: 'server_b',
        define: {
          getScope (val, event) {
            var scope = getScope.apply(this, arguments)
            console.log('create scope and connect!')
            scope.set({
              key: 'server_bSCOPE_' + val,
              // double connection dont work obvisouly... have to do something about that
              // this is the exact setup for users that nice
              // make level load scopes and boom
              adapter: {
                [key]: key === 'mock' ? 'scope_connection_server_a' : 'ws://localhost:6001',
                scope: val
              }
            })
            return scope
          }
        }
      })

      a.set({
        adapter: {
          id: 'scope_connection_server_a',
          inject: protocol
        }
      })

      b.set({
        adapter: {
          id: 'scope_connection_server_b',
          inject: protocol
        }
      })

      a.adapter.set({ [key]: { server: key === 'mock' ? 'scope_connection_server_a' : 6001 } })
      b.adapter.set({ [key]: { server: key === 'mock' ? 'scope_connection_server_b' : 6002 } })

      // recievers
      receiverA1 = new Hub({ key: 'receiverA1' })
      receiverA2 = new Hub({ key: 'receiverA2' })

      receiverA1.set({
        adapter: {
          id: 'scope_connection_receiver_A1',
          inject: protocol
        }
      })

      receiverA2.set({
        adapter: {
          id: 'scope_connection_receiver_A2',
          inject: protocol
        }
      })
    })

    it('receiverA1 can connect to b, b._scopes.A1 gets connected to a', function (done) {
      receiverA1.adapter.set({
        scope: 'a1',
        [key]: key === 'mock' ? 'scope_connection_server_b' : 'ws://localhost:6002'
      })
      global.r1 = receiverA1
      global.a = a
      global.b = b
      setTimeout(function (data) {
        b._scopes.a1.adapter[key].connected.is(true, function () {
          console.log('yo')
          expect(receiverA1.adapter[key].connected.val).to.equal(true)
          setTimeout(() => {
            expect(a._scopes.a1).to.be.ok
            done()
          }, 50)
        })
      }, 50)
    })

    it('a1 has scope with correct clients object', function () {
      expect(a).to.have.property('_scopes')
        .which.has.property('a1')
        .which.has.property('clients')
        .which.has.property('scope_connection_server_b')
    })

    it('a set a field on scope a1', function (done) {
      receiverA1.$({
        somefield: { val: true }
      })
      a._scopes.a1.set({
        somefield: { val: true }
      })
      receiverA1.get('somefield', {}).is(true).then(() => done())
    })

    it('receiverA2 can connect to b, b._scopes.A2 gets connected to a, shares connection', function (done) {
      setTimeout(function () {
        expect(b._scopes).to.have.property('a2')
        b._scopes.a2.adapter[key].connected.is(true, function () {
          expect(receiverA2.adapter[key].connected.val).to.equal(true)
          setTimeout(function () {
            expect(a._scopes).has.property('a2')
            done()
          }, 50)
          a.once('new', () => done())
        })
      }, 50)
      receiverA2.adapter.set({
        scope: 'a2',
        [key]: key === 'mock' ? 'scope_connection_server_b' : 'ws://localhost:6002'
      })
    })

    it('a2 has scope with correct clients object', function () {
      expect(a).to.have.property('_scopes')
        .which.has.property('a2')
        .which.has.property('clients')
        .which.has.property('scope_connection_server_b')
    })

    it('a set a field on scope a2', function (done) {
      receiverA2.$({
        anotherfield: { val: true }
      })
      a._scopes.a2.set({ anotherfield: true })
      receiverA2.get('anotherfield', {}).is(true).then(() => {
        expect(receiverA1).to.not.have.property('anotherfield')
        done()
      })
    })
  })
}

// now lets go for references!!!
