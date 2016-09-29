'use stirct'
const vstamp = require('vigour-stamp')
const isObj = require('vigour-util/is/obj')

exports.define = {
  extend: {
    // rename isNew arg to forceUpdate
    set (method, val, stamp, nocontext, isNew) {
      // const slist = this.root.incomingStamps
      const obj = isObj(val)
      if (obj) {
        if (val.stamp) {
          if (
            this.stamp !== val.stamp ||
            (
              (this.val && typeof this.val !== 'object') ||
              vstamp.type(stamp) !== 'force'
            )
            ) {
            stamp = val.stamp
            if (vstamp.type(stamp) === 'force') { isNew = true }
          }
          delete val.stamp
        }
      }

      // if (vstamp.type(stamp) === 'force') {
      //   console.log('FORCE', this.path())
      // }

      if (stamp && this.stamp) {
        if (Number(vstamp.val(stamp)) < Number(vstamp.val(this.stamp))) {
          if (!obj) {
            return
          } else if (val.val) {
            console.warn('BLOCK', this.path())
            delete val.val
          }
        }
      }

      const changed = method.call(this, val, stamp, nocontext, isNew)
      return changed
    }
  }
}
