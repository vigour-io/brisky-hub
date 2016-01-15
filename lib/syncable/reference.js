'use strict'
var _setKeyInternal = require('vigour-js/lib/observable').prototype.setKeyInternal
exports.define = {
  setKeyInternal: function (key, val, property, event, nocontext, escape) {
    // double check this
    console.group()
    console.warn('start it')
    if (val instanceof Array && val[0] === '$') {
      // maybe add a symbol or something?
      val.shift()
      val = (this.adapter ? this : this.lookUp('adapter').parent).get(val, {}, event)
    }
    console.warn('make it now event do it!', event, this._path)
    console.groupEnd()
    return _setKeyInternal.call(this, key, val, property, event, nocontext, escape)
  }
}
