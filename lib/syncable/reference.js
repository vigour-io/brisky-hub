'use strict'
var _setKeyInternal = require('vigour-js/lib/observable').prototype.setKeyInternal
exports.define = {
  setKeyInternal: function (key, val, property, event, nocontext, escape) {
    if (event && event.upstream && val instanceof Array) {
      val = (this.adapter ? this : this.lookUp('adapter').parent).get(val, {})
    }
    return _setKeyInternal.call(this, key, val, property, event, nocontext, escape)
  }
}
