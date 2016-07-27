'use stirct'
const vstamp = require('vigour-stamp')
const isObj = require('vigour-util/is/obj')
const slist = {}

exports.define = {
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
        }
      }
      if (stamp && this.stamp) {
        if (vstamp.val(stamp) < vstamp.val(this.stamp)) {
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
}
