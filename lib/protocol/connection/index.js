'use strict'
var Observable = require('vigour-js/lib/observable')
var _set = require('vigour-js/lib/observable/on/constructor')
  .prototype.set

module.exports = exports = new Observable({
  properties: {
    type: true
  },
  on: {
    new () {
      console.log('im making a new connection douche')
    },
    remove () {
      console.log('im removing a connection douche')
    }
  }
}).Constructor

exports.prototype._on.define({
  set () {
    console.log('something ON-like happening with on here???')
    return _set.apply(this, arguments)
  }
})
