'use strict'
var Observable = require('vigour-js/lib/observable')
/*
getting referenced / reference gets removed
 kill connection if the only client left
 send  client info ??????
*/
var connections = {}
var _set = require('vjs/lib/observable/on/constructor')
  .prototype.set

module.exports = exports = new Observable({
  on: {
    new () {
      connections[this.uid] = this
      // here it should add the connection -- are when its active or somehting
    }
  },
  define: {
    // these methods all have to be implemented in protocol?
    // use instances as storage?
    // protocol in adapter -- connection in?
    // want to be able to remove scopes etc without killing the protocol
    // share all connections in one map?
    send () {
      console.log('send!')
    },
    recieve () {
      console.log('recieve!')
    },
    connect () {
      console.log('connect!')
    },
    disconnect () {
      console.log('disconnect!')
    }
  }
}).Constructor

exports._on.define({
  set () {
    console.log('something happening with on here???')
    return _set.apply(this, arguments)
  }
})
