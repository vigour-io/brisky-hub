'use strict'
const State = require('vigour-state')
// const subscribe = require('vigour-state/subscribe')

module.exports = new State({
  type: 'syncstate',
  Child: 'Constructor',
  properties: {
    sync: { val: true }
  }
}).Constructor
