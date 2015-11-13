'use strict'
var Observable = require('vigour-js/lib/observable')
var _set = require('vigour-js/lib/observable/on/constructor').prototype.set

// need to store have to know if one exists allready, hash characterictics or something
// e.g patterns or whatever do it fast
// what is the common characteristic?
// up + down + protocol type

module.exports = exports = new Observable({
  on: {}
  //   new () {
  //     console.log('im making a new connection douche')
  //   },
  //   remove () {
  //     console.log('im removing a connection douche')
  //   }
  // }
}).Constructor

exports.prototype._on.define({
  set (val, event) {
    // console.log('something ON-like happening with on here???', val)
    return _set.apply(this, arguments)
  }
})
