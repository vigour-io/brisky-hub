'use strict'
var Observable = require('vigour-observable')
var _get = Observable.prototype.get
exports.define = {
  get (path, val, event) {
    return _get.call(this, path, val, event || false) // do this by default in base
  }
}
