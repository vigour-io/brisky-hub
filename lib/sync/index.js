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
        // ----------------------------------
        // just allways do this and add upstream gaurd in serialize
        // just add the src to the stamp allways nos pecial handling , no original stamp
        const originalStamp = s
        const hub = this.root
        var sendUp
        if ((this.syncUp || this.syncDown)) {
          const src = vstamp.src(s)
          if (src) {
            // the double case
            this.stamp = s
            if (src !== hub.id) {
              const client = hub.get([ 'clients', src ])
              if (hub.client && client && client.upstream) { // is this real nessecary -- isnt this allways if its not your client?
                if (client.upstream.compute() === hub.id) {
                  if (hub.client && hub.client.val) {
                    sendUp = true
                  }
                }
              }
            }
          } else if (!src) { // src === myself
            s = vstamp.setSrc(s, hub.id)
            this.stamp = s
            if (hub.client && this.syncUp) {
              if (hub.client.val && (!this.syncUpIsFn || this.syncUp(this))) {
                sendUp = true
              }
            }
          }
        } else {
          this.stamp = s
        }
        upTree(this, s, originalStamp, hub.incoming)
        if (sendUp) {
          hub.client.origin().send(this, void 0, originalStamp)
        }
      }
    }
  },
  child: 'Constructor'
}, false).Constructor

function upTree (target, stamp, originalStamp, incoming) {
  target.stamp = stamp
  if (target._subscriptions && !incoming) {
    vstamp.on(originalStamp, () => target.emit('subscription', void 0, originalStamp))
  }
  const baseEmitters = target._emitters._data && target._emitters._data.base
  baseEmitters && baseEmitters.each(ref => upTree(ref, stamp, incoming))
  const parent = target.cParent()
  if (parent && parent.stamp !== stamp) {
    upTree(parent, stamp, originalStamp, incoming)
  }
}
