'use strict'
const State = require('vigour-state')
// const vstamp = require('vigour-stamp')
const subscribe = require('vigour-state/subscribe')
const set = require('lodash.set')

// extend set to flavour sets with a src id!
module.exports = new State({
  type: 'syncstate',
  Child: 'Constructor',
  define: {
    subscribe (subs, update, tree, stamp, attach, id) {
      // console.log('lets subscribe!', subs)
      // also need to do something with stamps...
      const hub = this.getRoot()
      const subscription = {
        subscription: subs
      }
      hub.sendUpstream(subscription)

      subscribe(this, subs, function (state, type, stamp, subs, tree, sType) {
        // console.log(type, state.path().join('/'), vstamp.parse(stamp))
        // can check the stamp if its my own
        // lodash.set

        const payload = {
          stamp: state._lstamp,
          data: {}
        }
        set(payload.data, state.path(), state.serialize())

        if (hub.downstream) {
          // not for yet need to share subs -- this is temp!

          // for (let i in hub.downstream) {
            // stamp flavouring will come
            // console.log('send downstream', i, payload)
            // hub.downstream[i].send(JSON.stringify(payload))
          // }
          hub.downstream[id].send(JSON.stringify(payload))
        }

        hub.sendUpstream(payload)

        if (update) {
          update(state, type, stamp, subs, tree, sType)
        }
      }, tree, stamp, attach, id)
    }
  }
}).Constructor
