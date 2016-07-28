'use strict'
const test = require('tape')
const Hub = require('../')
const vstamp = require('vigour-stamp')

test('clients', function (t) {
  const subs = {
    $any: { val: true },
    special: {
      reference: { val: true }
    },
    clients: { $any: { val: true } }
  }
  t.end()
})
