'use strict'
const State = require('vigour-state')
// const vstamp = require('vigour-stamp')
const subscribe = require('vigour-state/subscribe')

// extend set to flavour sets with a src id!
module.exports = new State({
  type: 'syncstate',
  Child: 'Constructor',
  define: {
    subscribe (subs, update, tree, stamp, attach, id) {
      // console.log('lets subscribe!', subs)
      // also need to do something with stamps...
      const hub = this.getRoot()

      const santizedSubs = sanatizeSubs({}, subs)

      const subscription = {
        subscription: santizedSubs
      }

      console.log(santizedSubs)
      hub.sendUpstream(subscription)

      subscribe(this, subs, function (state, type, stamp, subs, tree, sType) {
        // can check the stamp if its my own
        // lodash.set

        const payload = {
          stamp: state._lstamp + Math.random() * 999,
          data: {}
        }

        // payload.data = state.getRoot().serialize()

        console.log(state.path(), state.serialize())
        setMerge(payload.data, state.path(), state.serialize())
        console.log(payload.data)

        if (hub.downstream) {
          // not for yet need to share subs -- this is temp!

          // for (let i in hub.downstream) {
            // stamp flavouring will come
            // console.log('send downstream', i, payload)
            // hub.downstream[i].send(JSON.stringify(payload))
          // }
          if (hub.downstream[id]) {
            hub.downstream[id].send(JSON.stringify(payload))
          }
        }

        hub.sendUpstream(payload)

        if (update) {
          update(state, type, stamp, subs, tree, sType)
        }
      }, tree, stamp, attach, id)
    }
  }
}).Constructor

function sanatizeSubs (target, subs) {
  for (var i in subs) {
    if (i !== '_') {
      if (i === 'val' || i === 'done') {
        target[i] = subs[i]
      } else {
        target[i] = {}
        target[i] = sanatizeSubs(target[i], subs[i])
      }
    }
  }
  return target
}

function setMerge (target, path, set) {
  for (var i in path) {
    if (i == path.length - 1) { //eslint-disable-line
      target[path[i]] = set
    } else if (!target[path[i]]) {
      target = target[path[i]] = {}
    }
  }
}
