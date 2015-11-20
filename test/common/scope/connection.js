'use strict'
require('colors-browserify')

describe('multiple upstreams, multiple scopes, multiple clients over single connection', function () {
  var Hub = require('../../../lib')
  var Mock = require('../../../lib/protocol/mock')
  var getScope = Hub.prototype.getScope
  // servers
  var a = global.a = new Hub({ key: 'server_a' })
  var b = global.b = new Hub({
    key: 'server_b',
    define: {
      getScope (val, event) {
        var scope = getScope.apply(this, arguments)
        console.group()
        console.log('hey scope!', val, scope.adapter.mock.val, this.adapter.mock.val, this !== scope)
        // for some reason it does not create a new mock/adapter on scope
        // allready has the upstream!

        // var dont
        // if(typeof this.adapter.mock.val !== 'string') {
          console.log('1'.red.bold, this !== scope, this.adapter === scope.adapter)
          // dont = true
        // }
        scope.set({
          key: 'server_bSCOPE_' + val,
          adapter: {
            mock: 'scope_connection_server_a',
            scope: val
          }
        })

        // if(dont) {
          console.log('2'.red.bold, this.adapter !== scope.adapter, this.adapter.mock !== scope.adapter.mock)
          // this is suddenly the same????
          console.log(this.adapter.mock.val !== scope.adapter.mock.val, this.adapter.mock.val)
        // }

        console.log('should have fired!-------------\n\n')
        console.groupEnd()
        return scope
      }
    }
  })

  a.set({
    adapter: {
      id: 'scope_connection_server_a',
      mock: new Mock()
    }
  })

  b.set({
    adapter: {
      id: 'scope_connection_server_b',
      mock: new Mock()
    }
  })

  a.adapter.mock.set({ server: 'scope_connection_server_a' })
  b.adapter.mock.set({ server: 'scope_connection_server_b' })

  // recievers
  var receiverA1 = new Hub({ key: 'receiverA1' })
  var receiverA2 = new Hub({ key: 'receiverA2' })

  receiverA1.set({
    adapter: {
      id: 'scope_connection_receiver_A1',
      mock: new Mock()
    }
  })

  receiverA2.set({
    adapter: {
      id: 'scope_connection_receiver_A2',
      mock: new Mock()
    }
  })

  it('receiverA1 can connect to b, b._scopes.A1 gets connected to a', function (done) {
    receiverA1.adapter.set({
      scope: 'a1',
      mock: 'scope_connection_server_b'
    })
    receiverA1.adapter.mock.once('connect', function () {
      setTimeout(done, 50) // once b connects to a
    })
  })

  it('a1 has scope with correct clients object', function () {
    expect(a).to.have.property('_scopes')
      .which.has.property('a1')
      .which.has.property('clients')
      .which.has.property('scope_connection_server_b')
  })

  it('a set a field on scope a1', function () {
    a._scopes.a1.set({
      somefield: true
    })
    expect(receiverA1).to.have.property('somefield')
  })

  it('receiverA2 can connect to b, b._scopes.A2 gets connected to a, shares connection', function (done) {
    // console.clear()
    // this test is failing so make it better (connect on server is what has to be tested! hard to do since scope is not there yet)
    console.log('!!!TEST!!!'.magenta.bold.inverse)
    // console.log(receiverA2.adapter.mock.connections === receiverA1.adapter.mock.connections)
    // console.log(require('../../../lib/protocol/mock').prototype.connections)
    // so this goes wrong for some reason the stuff gets added on the prototype!
    receiverA2.adapter.set({
      scope: 'a2',
      mock: 'scope_connection_server_b'
    })
    receiverA2.adapter.mock.once('connect', function () {
      setTimeout(done, 50)
    })
  })

  xit('a2 has scope with correct clients object', function () {
    expect(a).to.have.property('_scopes')
      .which.has.property('a2')
      .which.has.property('clients')
      .which.has.property('scope_connection_server_b')
  })

  xit('a set a field on scope a2', function () {
    a._scopes.a2.set({
      somefield: true
    })
    expect(receiverA2).to.have.property('somefield')
  })
})
