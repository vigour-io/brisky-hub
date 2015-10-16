'use strict'
var Observable = require('../observable')
var _remove = Observable.prototype.remove
var Event = require('vjs/lib/event')
module.exports = new Observable({
  properties: {
    connection: true
  },
  define: {
    remove (event, nocontext, noparent) {
      // need to remove all refs!
      return _remove.call(this, event, nocontext, noparent)
    }
  },
  ChildConstructor: 'Constructor'
}).Constructor

// connection moet shit doen
// remove also has to remove all references!
