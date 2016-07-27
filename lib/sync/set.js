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
        const p = vstamp.parse(stamp)
        if (Number(p.val) < Number(vstamp.parse(this.stamp).val)) {
          if (!obj) {
            // logmismatch(this, val, stamp)
            return
          } else if (val.val) {
            // logmismatch(this, val, stamp)
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

// function logmismatch (t, val, stamp) {
//   console.log(
//     'STAMP-MISMATCH: ', t.getRoot().id, t.path(),
//     '\n current:', t.val,
//     '\n new:', val,
//     '\n new-stamp:', stamp,
//     '\n current-stamp:', t.stamp
//   )
// }
