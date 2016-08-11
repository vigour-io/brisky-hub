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
              if (client && client.upstream) {
                if (client.upstream.compute() === hub.id) {
                  client.send(this, void 0, stamp)
                }
              }
            }
            this.stamp = stamp
          } else if (!src) {
            // creation of stamp
            // console.log('add stamp stuff!')
            stamp = vstamp.setSrc(stamp, hub.id)
            this.stamp = stamp
            if (hub.url && this.syncUp && hub.url.compute()) {
              const client = hub.client.origin()
              // remove the parity with subs
              client.send(this, void 0, stamp)
              // vstamp.on(originalStamp, () => vstamp.close(stamp))
            }
          }
        }
        var parent = this.cParent()
        // this.stamp = stamp
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
