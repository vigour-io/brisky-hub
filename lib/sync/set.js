'use stirct'
const vstamp = require('vigour-stamp')
const isObj = require('vigour-util/is/obj')

exports.define = {
  extend: {
    set (method, val, stamp, nocontext, isNew) {
      const slist = this.root.incomingStamps
      const obj = isObj(val)
      if (obj) {
        if (val.stamp) {
          stamp = val.stamp
          delete val.stamp
          if (slist && !slist[stamp]) {
            slist[stamp] = true
          }
        }
      }
      if (stamp && this.stamp) {
        if (Number(vstamp.val(stamp)) < Number(vstamp.val(this.stamp))) {
          console.log('BLOCK', this.path())
          if (!obj) {
            return
          } else if (val.val) {
            delete val.val
          }
        }
      }
      const changed = method.call(this, val, stamp, nocontext, isNew)
      return changed
    }
  }
}
