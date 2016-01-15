'use strict'
var _setKeyInternal = require('vigour-js/lib/observable').prototype.setKeyInternal
exports.define = {
  setKeyInternal: function (key, val, property, event, nocontext, escape) {
    if (val instanceof Array && val[0] === '$') {
      val.shift()
      val = (this.adapter ? this : this.lookUp('adapter').parent).get(val, {}, event)
    }
    return _setKeyInternal.call(this, key, val, property, event, nocontext, escape)
  }
}
