'use strict'
const State = require('vigour-state')
const vstamp = require('vigour-stamp')
const subscribe = require('vigour-state/subscribe')
const serialize = require('./subscription/serialize')
const downstream = require('./subscription/downstream')

module.exports = new State({
  type: 'sync',
  define: {
    isSync: { value: true },
    subscribe (subs, update, tree, stamp, attach, id) {
      console.log('here we go, hub allways needs an id / know the generate id')
      console.log('also needs to share')
      // may not need this check (multi upstream)
      if (attach && attach.isClient) {
        console.log('down stream subs')
        update = function (state, type) {
          if (state.syncDown) {
            const stamp = state._lstamp
            if (stamp) {
              const src = vstamp.src(stamp)
              if (attach.key !== src) {
                console.log(stamp)
                console.log('this has to go DOWN', state.path(), type)
              } else {
                console.log('this is my own so dont send it down!', state.path())
              }
            }
          }
        }
      }

      tree = subscribe(this, subs, update, tree, stamp, attach, id)

      if (!attach || !attach.isClient) {
        console.log('a subs we want to sync!', subs)
        let hub = this.getRoot()
        let hubSubs = hub.subscriptions
        if (!hubSubs) { hubSubs = hub.subscriptions = {} }
        const path = this.realPath(false, true)
        if (path.length > 0) {
          // this.id need to include path for this one
          console.log('need to resolve path -- do a bit later')
        } else {
          if (!id) { id = this.__on.subscription._id }
          console.log('  single subs do it', id)
          hubSubs[id] = serialize(subs) // needs to parse the subs
        }
      }
      return tree
    }
  },
  properties: {
    // maybe add .sync faster check
    syncUp: { val: true },
    syncDown: { val: true }
  },
  on: {
    data: {
      lstamp: function lstamp (val, stamp) {
        const originalStamp = stamp
        if ((this.syncUp || this.syncDown) && !vstamp.hasSrc(stamp)) {
          let hub = this.getRoot()
          stamp = vstamp.setSrc(stamp, hub.id)
          if (hub.url && this.syncUp && hub.url.compute()) {
            hub.sendUp(this, val, stamp)
            vstamp.on(originalStamp, () => vstamp.close(stamp))
          }
        }
        var parent = this.cParent()
        this._lstamp = stamp
        if (this._subscriptions) {
          let l = this
          vstamp.on(originalStamp, function () {
            l.emit('subscription', val, stamp)
          })
        } else {
          while (parent && parent._lstamp !== stamp) {
            lstampInner(parent, val, stamp, originalStamp)
            parent = parent.cParent()
          }
        }
      }
    }
  },
  Child: 'Constructor'
}, false).Constructor

function lstampInner (parent, val, stamp, originalStamp) {
  parent._lstamp = stamp
  if (parent._subscriptions) {
    let l = parent
    vstamp.on(originalStamp, function () {
      l.emit('subscription', val, stamp)
    })
  } else if ('base' in parent.__on._data) {
    if (parent.__on._data.base) {
      parent.__on._data.base.each(function (p) {
        lstampInner(p, val, stamp, originalStamp)
      })
    }
  }
}
