'use strict'
var _setKeyInternal = require('vigour-js/lib/observable').prototype.setKeyInternal
exports.define = {
  setKeyInternal: function (key, val, property, event, nocontext, escape) {
    if (
      typeof val === 'object' &&
      val !== null && val.val &&
      val.val.reference &&
      val.val.reference instanceof Array
    ) {
      val.val.reference.unshift('$')
      val = val.val.reference
    }
    if (val instanceof Array && val[0] === '$') {
      val = getRef(this, val)
    }
    return _setKeyInternal.call(this, key, val, property, event, nocontext, escape)
  }
}

function getRef (obs, val) {
  var hub = (obs.adapter ? obs : obs.lookUp('adapter').parent)
  var comparep = obs.syncPath
  var useParent
  val.shift()
  var target = hub
  for (let i = 0, length = val.length; i < length; i++) {
    var segment = val[i]
    if (!target[segment] || useParent) {
      if (comparep[i] === val[i]) {
        useParent = true
      } else {
        val = val.slice(i)
        if (useParent) {
          let l = (comparep.length - 1) - i
          let p = obs
          while (l > -1) {
            p = p._contextLevel === 1 ? p._context : p._parent
            l--
          }
          return p.get(val, {})
        } else {
          return target.get(val, {})
        }
      }
    } else {
      target = target[segment]
    }
  }
  return target
}
