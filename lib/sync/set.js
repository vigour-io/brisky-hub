'use stirct'
const vstamp = require('vigour-stamp')
const isObj = require('vigour-util/is/obj')

exports.define = {
  extend: {
    set (method, val, stamp, nocontext, isNew) {
      const hub = this.root
      const incoming = hub.incoming
      const obj = isObj(val)
      var s

      if (incoming && incoming.receiving) {
        stamp = false
        s = this.stamp
      }

      if (obj) {
        if (val.stamp) {
          stamp = val.stamp
          delete val.stamp
          if (incoming && !incoming[stamp]) {
            incoming[stamp] = true
          }
        }
      }
      if (stamp && this.stamp) {
        if (Number(vstamp.val(stamp)) < Number(vstamp.val(this.stamp))) {
          // console.log('BLOCK', this.path())
          if (!obj) {
            return
          } else if (val.val) {
            delete val.val
          }
        }
      }
      const changed = method.call(this, val, stamp, nocontext, isNew)

      if (incoming && incoming.receiving && changed && this.stamp === s) {
        console.log(' now we got the target:', this.path())
        force(this, incoming.receiving)
      }

      return changed
    }
  }
}

function force (target, obj) {
  while (target) {
    obj[target.sid()] = true
    if (target._emitters._data.base) {
      // if you do parent this is nessecary
      target._emitters._data.base.each(p => force(p, obj))
    }
    target = target.parent
  }
}
