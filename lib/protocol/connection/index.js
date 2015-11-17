'use strict'
var Observable = require('vigour-js/lib/observable')
var _set = require('vigour-js/lib/observable/on/constructor').prototype.set
var Client = require('../../client')
// need to store have to know if one exists allready, hash characterictics or something
// e.g patterns or whatever do it fast
// what is the common characteristic?
// up + down + protocol type

module.exports = exports = new Observable({
  on: {
    remove: {
      clients (data, event) {
        console.log('2 - xxxx?????', this._on)
        this._on.data.base.each(function (property, key) {
          if (property.parent instanceof Client) {
            console.log('got myself a client lets remove it!', property.parent.key)
            property.parent.remove(event)
          }
        })
      }
    },
    close: {
      reconnect (data, event) {
        console.error('hey i just closed my shit! have to reconnect!')
      }
    }
  }
}).Constructor

// exports.prototype._on.define({
//   set (val, event) {
//     // importnt for what?
//     // console.log('something ON-like happening with on here???', val)
//     return _set.apply(this, arguments)
//   }
// })
