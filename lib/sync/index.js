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
    require('./sync')
  ],
  on: {
    data: {
      stamp (val, s) {
        const originalStamp = s
        // ----------------------------------
        // just allways do this and add upstream gaurd in serialize
        // just add the src to the stamp allways nos pecial handling , no original stamp
        if ((this.syncUp || this.syncDown)) {
          const hub = this.getRoot()
          const src = vstamp.src(s)
          if (src) {
            // the double case
            this.stamp = s
            if (src !== hub.id) {
              const client = hub.get([ 'clients', src ])
              if (hub.client && client && client.upstream) { // is this reall nessecary -- isnt this allways if its not your client?
                if (client.upstream.compute() === hub.id) {
                  if (hub.client && hub.client.val) { hub.client.origin().send(this, void 0, originalStamp) }
                }
              }
            }
          } else if (!src) { // src === myself
            s = vstamp.setSrc(s, hub.id)
            this.stamp = s
            if (hub.client && this.syncUp) {
              const client = hub.client.origin()
              if (hub.client.val && (!this.syncUpIsFn || this.syncUp(this))) {
                client.send(this, void 0, originalStamp)
              }
            }
          }
        } else {
          this.stamp = s
        }
        // ----------------------------------

        if (this._subscriptions) {
          let l = this
          if (!l.root.incomingStamps) {
            vstamp.on(originalStamp, () => {
              l.emit('subscription', void 0, originalStamp)
            })
          }
        } else {
          let parent = this.cParent()
          while (parent && parent.stamp !== s) {
            lstampInner(parent, val, s, originalStamp)
            parent = parent.cParent()
          }
        }
      }
    }
  },
  child: 'Constructor'
}, false).Constructor

function lstampInner (parent, val, stamp, originalStamp) {
  // NEED THIS
  if (!parent.stamp || Number(vstamp.val(stamp)) > Number(vstamp.val(parent.stamp))) {
    parent.stamp = stamp
  }

  if (parent._subscriptions) {
    let l = parent
    if (!l.root.incomingStamps) {
      vstamp.on(originalStamp, () => {
        l.emit('subscription', void 0, originalStamp)
      })
    }
  } else if ('base' in parent._emitters._data) {
    if (parent._emitters._data.base) {
      parent._emitters._data.base.each(p => lstampInner(p, val, stamp, originalStamp))
    }
  }
}
