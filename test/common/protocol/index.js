'use strict'

describe('protocol', function () {
  var Protocol = require('../../../lib/protocol')
  var Connection = require('../../../lib/protocol/connection')
  it('can create a new connection', function () {
    var connection = new Connection() // eslint-disable-line
  })
  it('can create a new protocol', function () {
    var connection = new Protocol() // eslint-disable-line
  })
})

describe('hubs', function () {
  var a, b // eslint-disable-line
  var Hub = require('../../../lib')
  it('can create multiple hubs', function () {
    a = new Hub({
      key: 'a'
    })

    b = new Hub({
      key: 'b'
    })
  })

  it('can set the adapater using a mock protocol', function () {
    a.set({
      adapter: {
        // multiple protocols! -- first just one
        // different down then up for example!
        protocol: require('../../../lib/protocol/mock')
        // down and up in protocol e.g. webrtc! being able to define 2
        // tcp how to switch when an upstream can recieve tcp - this is the issue
      }
    })
  })
})
