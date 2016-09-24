'use stirct'

const debug = require('vigour-stamp/debug')

const vstamp = require('vigour-stamp')


// think of a way to deal with this
// debug(vstamp) -- context stamp is wrong but want that to fire first

const isObj = require('vigour-util/is/obj') // brisky-is-obj

exports.define = {
  extend: {
    set (set, val, stamp, nocontext, isNew) {
      // const slist = this.root.incomingStamps
      const obj = isObj(val)


      var t
      if (obj) {
        if (val.stamp) {
          t = val.stamp
          // this is rly rly messed up -- has to be one stamp
          // if (slist && !slist[stamp]) {
          //   slist[stamp] = true
          // }
        }
      }
      if (t && this.stamp) {
        if (Number(vstamp.val(t)) < Number(vstamp.val(this.stamp))) {
          if (!obj) {
            return
          } else if (val.val) {
            delete val.val
          }
        }
      }

      if (t) {
        this.stamp = t
      }

      // dont fire though.. how to do that?
      const changed = set.call(this, val, stamp, nocontext, isNew)
      return changed
    }
  },
  isSync: true
}
