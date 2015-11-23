'use strict'

describe('multiple adapters, multiple scopes', function () {
  var Hub = require('../../../lib')
  var Mock = require('../../../lib/protocol/mock')

  var serverA = new Hub({
    adapter: {
      id: 'm_scope_a',
      mock: new Mock()
    }
  })

  var serverB = new Hub({
    adapter: {
      id: 'm_scope_b',
      mock: new Mock()
    }
  })

  serverA.adapter.set({
    mock: {
      server: 'm_scope_a'
    }
  })

  serverB.adapter.set({
    mock: {
      server: 'm_scope_b'
    }
  })

  var receiver = new Hub({
    a: {
      adapter: {
        id: 'm_scope_receiver_a',
        mock: new Mock(),
        scope: 'james'
      }
    },
    b: {
      adapter: {
        id: 'm_scope_receiver_b',
        mock: new Mock(),
        scope: 'youzi'
      }
    }
  })

  it('receiver a and b can connect to servers', function (done) {
    receiver.a.adapter.mock.val = 'm_scope_a'
    receiver.a.adapter.mock.once('connect', function () {
      receiver.b.adapter.mock.val = 'm_scope_b'
      receiver.b.adapter.mock.once('connect', function () {
        done()
      })
    })
  })

  it('serverA has james scope', function () {
    expect(serverA._scopes).to.have.property('james')
      .which.has.property('clients')
      .which.has.property('m_scope_receiver_a')
  })

  it('serverB has youzi scope', function () {
    expect(serverB._scopes).to.have.property('youzi')
      .which.has.property('clients')
      .which.has.property('m_scope_receiver_b')
  })
})
