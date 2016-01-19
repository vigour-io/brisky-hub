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
      val.shift()
      val = (this.adapter ? this : this.lookUp('adapter').parent).get(val, {}, event)
    }
    return _setKeyInternal.call(this, key, val, property, event, nocontext, escape)
  }
}
