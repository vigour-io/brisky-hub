'use strict'
var Observable = require('vigour-js/lib/observable')
var _get = Observable.prototype.get
exports.define = {
  get (path, val, event) {
    console.error('here i am gettin', path, event)
    return _get.call(this, path, val, event || false)
    console.error('here i am gettin???', path, event)
  }
}
