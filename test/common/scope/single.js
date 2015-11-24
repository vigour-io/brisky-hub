'use strict'

describe('single scope', function () {
  var Hub = require('../../../lib')
  var mock = require('../../../lib/protocol/mock')
  var server = new Hub({
    key: 'single_server'
  })
  var receiver = new Hub({
    key: 'single_receiver'
  })

  server.set({
    adapter: {
      id: 'single_server',
      inject: mock,
      mock: {
        server: 'single_server'
      }
    }
  })

  receiver.set({
    adapter: {
      id: 'single_receiver',
      inject: mock,
      mock: {}
    }
  })

  it('can connect to a scope', function (done) {
    receiver.adapter.set({
      mock: 'single_server',
      scope: 'myScope'
    })
    receiver.adapter.mock.once('connect', function () {
      expect(server).to.not.have.property('clients')
      expect(server).to.have.property('_scopes')
        .which.has.property('myScope')
      expect(server._scopes.myScope).to.have.property('clients')
      done()
    })
  })

  it('merges sets from the original sever to client', function () {
    server.set({ youri: true })
    expect(receiver.youri.val).to.equal(true)
  })

  it('merges sets from the "myScope" on the sever to client', function () {
    server._scopes.myScope.set({ james: true })
    expect(receiver.james.val).to.equal(true)
  })

  it('set from client to server only manipulates "myScope"', function () {
    receiver.set({bla: 'hey'})
    expect(server.bla).to.be.not.ok
    expect(server._scopes.myScope.bla).to.be.ok
  })

  it('can change scope dynamicly', function () {
    receiver.set({ adapter: { scope: 'rick' } })
    expect(server._scopes).to.have.property('rick')
  })

  it('removed client correct, added client to correct scope', function () {
    expect(server._scopes.rick)
      .to.have.property('clients')
      .which.has.property('single_receiver')
    expect(server._scopes.myScope.clients.single_receiver).not.ok
  })

  it('recieves updates on scope "rick"', function () {
    server._scopes.rick.set({ james: 'yes' })
    expect(receiver.james.val).to.equal('yes')
  })

  it('recieves updates from non-scoped', function () {
    server.set({ randomfield: true })
    expect(receiver).to.have.property('randomfield')
  })

  it('can disconnect and switch scope', function (done) {
    server._scopes.rick.clients['single_receiver'].connection.origin.remove()
    receiver.set({
      adapter: {
        scope: 'marcus'
      }
    })
    receiver.adapter.mock.once('connect', function () {
      expect(server._scopes).to.have.property('marcus')
        .which.has.property('clients')
        .which.has.property('single_receiver')
      expect(server._scopes.rick.clients.single_receiver).not.ok
      done()
    })
  })

  it('can switch from scoped to non-scoped', function () {
    receiver.set({
      adapter: {
        scope: false
      }
    })
    expect(server)
      .to.have.property('clients')
      .which.has.property('single_receiver')
  })

  it('can switch from non-scoped to scoped', function () {
    receiver.set({
      adapter: {
        scope: 'nika'
      }
    })
    expect(server.clients.single_receiver).to.not.ok
    expect(server._scopes).to.have.property('nika')
      .which.has.property('clients')
      .which.has.property('single_receiver')
  })

  it('can switch from a non-scope new reciever to scoped', function (done) {
    var reciever2 = new Hub({
      adapter: {
        id: 'single_receiver_2',
        inject: mock,
        mock: 'single_server'
      }
    })
    reciever2.adapter.mock.once('connect', function () {
      expect(server.clients.single_receiver_2).to.ok
      reciever2.adapter.set({
        scope: 'krystan'
      })
      expect(server.clients.single_receiver_2).to.not.ok
      expect(server._scopes).to.have.property('krystan')
        .which.has.property('clients')
        .which.has.property('single_receiver_2')
      done()
    })
  })
})
