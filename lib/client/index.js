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
      // need to remove all refs to client!!!
      return _remove.call(this, event, nocontext, noparent)
    },
    send (observable, hub, data, event) {
      if (this.connection && data !== void 0) {
        var path = observable._path
        if (path[0] === hub.key) {
          path.splice(0, 1)
        }
        if (typeof data === 'object') {
          for (var i in data) {
            if (observable._properties[i]) {
              delete data[i]
            }
          }
        }
        var ret = setwithpath({}, path, data)
        this.connection.send(JSON.stringify({ set: ret, stamp: event.stamp }))
      }
    }
  },
  ChildConstructor: 'Constructor'
}).Constructor

// connection is a flag for i am doing this one!

// connection moet shit doen
// remove also has to remove all references!
