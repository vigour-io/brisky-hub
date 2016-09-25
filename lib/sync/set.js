'use stirct'

const debug = require('vigour-stamp/debug')

const vstamp = require('vigour-stamp')


// think of a way to deal with this
// debug(vstamp) -- context stamp is wrong but want that to fire first

const isObj = require('vigour-util/is/obj') // brisky-is-obj

exports.define = {
  extend: {
    set (set, val, stamp, nocontext, isNew) {
      const obj = isObj(val)

      var t
      if (obj) {
        if (val.stamp) {
          t = val.stamp
          let block
          // this is rly rly messed up -- has to be one stamp
          const prevIncoming = this.root.incomingStamp
          // can only be 1

          if (t && this.stamp) {
            if (Number(vstamp.val(t)) < Number(vstamp.val(this.stamp))) {
              if (val.val) { delete val.val }
              block = true
            }
          }

          if (
            !prevIncoming ||
            Number(vstamp.val(prevIncoming)) < Number(vstamp.val(t))
          ) {
            console.log('ok bigger then the last one')
            if (!block) {
              console.log(this.path(), t)
              this.root.incomingStamp = t
            } else {
              console.log('but not passing... (block:true)')
            }
          }
        }
      }

      const changed = set.call(this, val, stamp, nocontext, isNew)
      return changed
    }
  },
  isSync: true // not really set...
}
