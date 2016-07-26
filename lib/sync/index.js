'use strict'
const State = require('vigour-state')
const vstamp = require('vigour-stamp')
const isObj = require('vigour-util/is/obj')

const slist = {}

// have to remove offset whe smoething comes in -- rly annoying

module.exports = new State({
  type: 'sync',
  inject: require('./subscription'),
  define: {
    extend: {
      remove (remove, stamp, noContext, noParent) {
        // function (stamp, noContext, noParent)
        var created
        if (stamp === void 0) {
          created = true
          stamp = vstamp.create()
        }
        if (this.tombstone && this._parent) {
          if (this.parent.val !== null) {
            // console.log(stamp)
            this.parent.set({
              tombstones: { [this.key]: stamp }
            }, false)
          }
        }
        const r = remove.call(this, stamp, noContext, noParent)
        if (created) {
          vstamp.close(stamp)
        }
        return r
      },
      contextRemove (contextRemove, key, stamp) {
        // bit harder
        console.log('CONTEXT-REMOVE')
        return contextRemove.call(this, key, stamp)
      },
      setKey (setKey, key, val, stamp, resolve, noContext) {
        if (!this[key]) {
          // all checks need to take offset into account
          // offset has to be a global off hub as well (first supplied by a upstream)
          // offset will be offset + more generic offset
          // so you have to offset stamps that are created by self
          if (stamp && this.tombstones && this.tombstones[key]) {
            // console.log(stamp, this.tombstones[key])
            const p = vstamp.parse(stamp)
            if (Number(p.val) - 1e3 < Number(vstamp.parse(this.tombstones[key]).val)) {
              console.log('TOMBSTONE ---> !!!!!', key)
              return
            }
          }
        }
        return setKey.call(this, key, val, stamp, resolve, noContext)
      },
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

        // console.log('incoming', val, this.getRoot().id)

        // if()

        if (stamp && this.stamp) {
          const p = vstamp.parse(stamp)
          if (Number(p.val) < Number(vstamp.parse(this.stamp).val)) {
            if (!obj) {
              logmismatch(this, val, stamp)
              console.log('?', this.path(), val, this.getRoot().id)
              return
            } else if (val.val) {
              logmismatch(this, val, stamp)
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
    tombstones: {
      type: 'base'
    },
    // need to use a function for sync -- in the funciton will recieve true if up or somethign
    syncUp: true,
    syncDown: true,
    tombstone: true,
    sync (val) {
      return this.set({
        syncUp: val,
        syncDown: val
      }, false)
    }
  },
  tombstone: true,
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

function logmismatch (t, val, stamp) {
  console.log(
    'STAMP-MISMATCH: ', t.getRoot().id, t.path(),
    '\n current:', t.val,
    '\n new:', val,
    '\n new-stamp:', stamp,
    '\n current-stamp:', t.stamp
  )
}
