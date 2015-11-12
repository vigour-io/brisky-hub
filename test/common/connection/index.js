'use strict'

describe('basic connection', function () {
  var Connection = require('../../../lib/connection')
  it('can create a connection', function () {
    var connection = new Connection()
    console.log('hey hey hey')

  })
})

describe('hubs', function () {
  var a, b
  var Hub = require('../../../lib')
  it('can create multiple hubs', function () {
    a = new Hub({
      key: 'a'
    }) // uuid used!
    b = new Hub({
      key: 'b'
    })
  })
})
