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
      console.log('???---------------------------')
      console.log('remove client', this.path)
      if (!event) {
        event = new Event(event, nocontext, noparent)
      }
      // var inClientsObj = this.parent && this.parent.get(['clients', this.val])
      // if (inClientsObj !== this && inClientsObj.origin === this) {
      console.log('??!!!remove references!!!')
        // inClientsObj.remove(event)
      // }
      // needs decay? first set disconnected -- then remove after a while
      console.log('---------------------------')
      return _remove.call(this, event)
    }
  },
  ChildConstructor: 'Constructor'
}).Constructor

// connection moet shit doen
// remove also has to remove all references!
