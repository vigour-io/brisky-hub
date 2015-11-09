'use strict'
// var uuid = require('vigour-js/util/uuid').val
describe('basic', function () {
  var a, b
  var Hub = require('../../../lib')
  it('can create a hub', function () {
    a = new Hub({
      key: 'a'
    }) // uuid used!
    b = new Hub({
      key: 'b'
    })
  })
})
