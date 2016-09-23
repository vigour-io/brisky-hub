'use stirct'
const vstamp = require('vigour-stamp')
const isObj = require('vigour-util/is/obj')

exports.define = {
  extend: {
    set (set, val, stamp, nocontext, isNew) {

      console.log('set:', val, this.path())

      const slist = this.root.incomingStamps
      const obj = isObj(val)
      if (obj) {
        if (val.stamp) {
          stamp = val.stamp
          if (!slist[stamp]) {
            slist[stamp] = true
          }
        }
      }
      if (stamp && this.stamp) {
        if (Number(vstamp.val(stamp)) < Number(vstamp.val(this.stamp))) {
          if (!obj) {
            return
          } else if (val.val) {
            delete val.val
          }
        }
      }
      const changed = set.call(this, val, stamp, nocontext, isNew)
      return changed
    }
  },
  isSync: true
}
