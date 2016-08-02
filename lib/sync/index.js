'use strict'
const State = require('vigour-state')
const vstamp = require('vigour-stamp')

module.exports = new State({
  type: 'sync',
  inject: [
    require('./subscription'),
    // require('./remove'), do this later tombstones need some thought
    require('./set'),
    require('./sync')
  ],
  on: {
    data: {
      stamp: function (val, stamp) {
        const originalStamp = stamp
        // again twice thats wrong!
        // console.log(stamp, this.getRoot().id, this.path(), val, this.getRoot().instances && this.getRoot().instances.length)
        if ((this.syncUp || this.syncDown)) {
          const src = vstamp.src(stamp)
          const hub = this.getRoot()
          if (src) {
            const client = hub.get([ 'clients', src ])
            if (client && client.upstream) {
              if (client.upstream.compute() === hub.id) {
                hub.sendUp(this, val, stamp)
              }
            }
          } else if (!src) {
            stamp = vstamp.setSrc(stamp, hub.id)
            if (hub.url && this.syncUp && hub.url.compute()) {
              hub.sendUp(this, val, stamp)
              // console.log('double emit?')
              vstamp.on(originalStamp, () => vstamp.close(stamp))
            }
          }
        }
        var parent = this.cParent()
        this.stamp = stamp
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
