'use strict'
const State = require('vigour-state')
const vstamp = require('vigour-stamp')
// const subscribe = require('vigour-state/subscribe')

module.exports = new State({
  type: 'sync',
  define: {
    isSync: { value: true }
  },
  properties: {
    syncUp: { val: true },
    syncDown: { val: true }
  },
  on: {
    data: {
      lstamp: function lstamp (val, stamp) {
        const originalStamp = stamp
        if (this.sync && !vstamp.hasSrc(stamp)) {
          let hub = this.getRoot()
          stamp = vstamp.setSrc(stamp, hub.id)
          if (hub.url && hub.url.compute()) {
            console.log('BEFORE SEND UPSTREAM --> my own data', stamp, this)
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
