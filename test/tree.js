'use strict'
const test = require('tape')
const Hub = require('../')
// const vstamp = require('vigour-stamp')

test('tree - exec function gaurds', (t) => {
  const server = new Hub({ port: 6000 })

  const subs = {}

  const client = new Hub({
    id: 1,
    context: false
  })
  const client1 = new Hub({
    id: 2,
    context: false
  })

})
