'use strict'
const State = require('vigour-state')
const vstamp = require('vigour-stamp')
const subscribe = require('vigour-state/subscribe')

module.exports = new State({
  type: 'syncstate',
  Child: 'Constructor',
  define: {
    subscribe (subs, update, tree, stamp, attach, id) {
      console.log('lets subscribe!')
      // also need to do something with stamps...
      subscribe(this, subs, function (state, type, stamp, subs, tree, sType) {
        console.log(type, state.path().join('/'), vstamp.parse(stamp))
        // can check the stamp if its my own
        update(state, type, stamp, subs, tree, sType)
      }, tree, stamp, attach, id)
    }
  }
}).Constructor
