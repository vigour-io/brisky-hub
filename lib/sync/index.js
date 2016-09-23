'use strict'
const State = require('vigour-state')
const vstamp = require('vigour-stamp')

module.exports = new State({
  type: 'sync',
  inject: [
    require('./subscription'),
    // require('./remove'), do this later tombstones need some thought
    require('./set'),
    require('./sync') // rename its all sync... "syncProperty"
  ],
  on: {
    data: {
      stamp: function (val, stamp) {
        const originalStamp = stamp
        if ((this.syncUp || this.syncDown)) {
          const src = vstamp.src(stamp)
          const hub = this.getRoot()
          if (src) {
            if (src !== hub.id) {
              const client = hub.get([ 'clients', src ])
              if (hub.client && client && client.upstream) {
                if (client.upstream.compute() === hub.id) {
                  if (hub.client && hub.client.val) { hub.client.origin().send(this, void 0, stamp) }
                }
              }
            }
            this.stamp = stamp
          } else if (!src) {
            stamp = vstamp.setSrc(stamp, hub.id)
            this.stamp = stamp
            if (this.syncUp && hub.client) {
              const client = hub.client.origin()
              if (hub.client.val) { client.send(this, void 0, stamp) }
            }
          }
        } else {
          this.stamp = stamp
        }
        var parent = this.cParent()
        if (this._subscriptions) {
          let l = this
          vstamp.on(originalStamp, () => {
            l.emit('subscription', val, typeof stamp !== 'string' ? String(stamp) : stamp)
          })
        } else {
          while (parent && parent.stamp !== stamp) {
            lstampInner(parent, val, stamp, originalStamp)
            parent = parent.cParent()
          }
        }
      }
    }
  },
  child: 'Constructor'
}, false).Constructor

function lstampInner (parent, val, stamp, originalStamp) {
  parent.stamp = stamp
  if (parent._subscriptions) {
    let l = parent
    vstamp.on(originalStamp, function () {
      l.emit('subscription', val, typeof stamp !== 'string' ? String(stamp) : stamp)
    })
  } else if ('base' in parent._emitters._data) {
    if (parent._emitters._data.base) {
      parent._emitters._data.base.each(function (p) {
        lstampInner(p, val, stamp, originalStamp)
      })
    }
  }
}
