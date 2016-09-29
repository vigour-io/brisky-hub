'use stirct'
const vstamp = require('vigour-stamp')
const isObj = require('vigour-util/is/obj')

exports.define = {
  extend: {
    set (method, val, stamp, nocontext, isNew) {
      // const slist = this.root.incomingStamps
      const obj = isObj(val)
      if (obj) {
        if (val.stamp) {
          // console.log('yo', val.stamp, this.path())
          if (vstamp.type(stamp) !== 'force') {
            stamp = val.stamp
            // this is not good since we want to keep the orginals not only forces everywhere

            if (vstamp.type(stamp) === 'force') {
              console.log('SET WITH FORCE', this.path())
              isNew = true
            }
          }
          delete val.stamp
        }
      }

      // if (stamp && this.stamp) {
      //   if (Number(vstamp.val(stamp)) < Number(vstamp.val(this.stamp))) {
      //     if (!obj) {
      //       return
      //     } else if (val.val) {
      //       console.warn('BLOCK', this.path())
      //       delete val.val
      //     }
      //   }
      // }

      const changed = method.call(this, val, stamp, nocontext, isNew)
      return changed
    }
  }
}
