'use strict'
var Observable = require('vigour-js/lib/observable')
/*
getting referenced / reference gets removed
 kill connection if the only client left
 send  client info ??????
*/
var _set = require('vigour-js/lib/observable/on/constructor')
  .prototype.set

// why not just use the instances???
module.exports = exports = new Observable({
  on: {
    new () {
      console.log('im making a new connection douche')
      // connections[this.uid] = this
      // here it should add the connection -- are when its active or somehting
    },
    remove () {
      console.log('im removing a connection douche')
      // connections[this.uid] = null
    }
  }
}).Constructor

exports.prototype._on.define({
  set () {
    console.log('something ON-like happening with on here???')
    return _set.apply(this, arguments)
  }
})
