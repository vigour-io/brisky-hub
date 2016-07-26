'use strict'
const State = require('vigour-state')
const vstamp = require('vigour-stamp')
const isObj = require('vigour-util/is/obj')

const slist = {}

module.exports = new State({
  type: 'sync',
  inject: require('./subscription'),
  define: {
    extend: {
      set (set, val, stamp, nocontext, isNew) {
        var created
        const obj = isObj(val)
        if (obj) {
          if (val.stamp) {
            stamp = val.stamp
            if (!slist[stamp]) {
              slist[stamp] = true
              created = true
            }
            // delete val.stamp // may not be nessecary -- onyl problem is sid fix this in state
          }
        }

        if (stamp && this.stamp) {
          const p = vstamp.parse(stamp)
          if (Number(p.val) < Number(vstamp.parse(this.stamp).val)) {
            console.log(
              'STAMP-MISMATCH: ', this.path(),
              '\n current:', this.val,
              '\n new:', val,
              '\n new-stamp:', stamp,
              '\n current-stamp:', this.stamp
            )
            if (!obj) {
              return
            } else if (val.val) {
              delete val.val
            }
          }
        }
        const changed = set.call(this, val, stamp, nocontext, isNew)
        if (created) {
          vstamp.close(stamp)
          delete slist[stamp]
        }
        return changed
      }
    },
    isSync: { value: true }
  },
  properties: {
    // need to use a function for sync -- in the funciton will recieve true if up or somethign
    syncUp: true,
    syncDown: true,
    sync (val) {
      return this.set({
        syncUp: val,
        syncDown: val
      }, false)
    }
  },
  syncUp: true,
  syncDown: true,
  on: {
    data: {
      stamp: function (val, stamp) {
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
        this.stamp = stamp
        if (this._subscriptions) {
          let l = this
          vstamp.on(originalStamp, function () {
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
