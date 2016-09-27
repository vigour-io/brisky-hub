'use strict'
const State = require('vigour-state')
const vstamp = require('vigour-stamp')

module.exports = new State({
  type: 'sync',
  define: { isSync: true },
  inject: [
    require('./subscription'),
    // require('./remove'), do this later tombstones need some thought
    require('./set'),
    require('./sync') // rename its all sync... "syncProperty"
  ],
  on: {
    data: {
      stamp (val, s) {
        const originalStamp = s

        if ((this.syncUp || this.syncDown)) {
          const hub = this.getRoot()
          const src = vstamp.src(s)
          if (src) {
            this.stamp = s
            if (src !== hub.id) {
              const client = hub.get([ 'clients', src ])
              if (hub.client && client && client.upstream) {
                if (client.upstream.compute() === hub.id) {
                  if (hub.client && hub.client.val) { hub.client.origin().send(this, void 0, s) }
                }
              }
            }
          } else if (!src) {
            s = vstamp.setSrc(s, hub.id)
            this.stamp = s
            if (hub.client && this.syncUp) {
              const client = hub.client.origin()
              if (hub.client.val && (!this.syncUpIsFn || this.syncUp(this))) {
                client.send(this, void 0, s)
              }
            }
          }
        } else {
          this.stamp = s
        }

        if (this._subscriptions) {
          let l = this
          if (!l.root.incomingStamps) {
            vstamp.on(originalStamp, () => {
              console.log('fire subscription', originalStamp, l.context && l.context.val)
              l.emit('subscription', val, originalStamp)
            })
          }
        } else {
          let parent = this.cParent()
          let receiving
          while (parent && parent.stamp !== s) {
            if (receiving === void 0) {
              receiving = !!parent.root.incomingStamps
            }
            lstampInner(parent, val, s, originalStamp, receiving)
            parent = parent.cParent()
          }
        }
      }
    }
  },
  child: 'Constructor'
}, false).Constructor

function lstampInner (parent, val, stamp, originalStamp, receiving) {
  // NEED THIS
  // if (!parent.stamp || Number(vstamp.val(stamp)) > Number(vstamp.val(parent.stamp))) {
  parent.stamp = stamp
  // }

  if (parent._subscriptions) {
    let l = parent
    if (!receiving) {
      vstamp.on(originalStamp, () => {
        console.log('fire subscription', originalStamp, l.context && l.context.val)
        l.emit('subscription', val, originalStamp)
      })
    }
  } else if ('base' in parent._emitters._data) {
    if (parent._emitters._data.base) {
      parent._emitters._data.base.each(p => lstampInner(p, val, stamp, originalStamp, receiving))
    }
  }
}
