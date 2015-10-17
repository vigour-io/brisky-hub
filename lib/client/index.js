'use strict'
var Observable = require('../observable')
var _remove = Observable.prototype.remove
var setwithpath = require('vjs/lib/util/setwithpath')
// var Event = require('vjs/lib/event')
module.exports = new Observable({
  properties: {
    connection: true
  },
  define: {
    remove (event, nocontext, noparent) {
      // need to remove all refs!
      return _remove.call(this, event, nocontext, noparent)
    },
    send (observable, data, event) {
      if (this.connection) {
        // connection needs to be an object
        if (event.type === 'client' && event.id === this.val) {
          console.log('      i just created this client do not send!')
        } else {
          console.log('      send to client:', this.val + ':', observable._path.join('.'), event.stamp)
          // path needs to set to first adapter found!
          var ret = setwithpath({}, observable._path, observable.serialize())
          this.connection.send(JSON.stringify({ set: ret }))
        }
      }
    }
  },
  ChildConstructor: 'Constructor'
}).Constructor

// connection is a flag for i am doing this one!

// connection moet shit doen
// remove also has to remove all references!
