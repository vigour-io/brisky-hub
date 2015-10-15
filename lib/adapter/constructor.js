'use strict'
var Observable = require('vjs/lib/observable')

module.exports = new Observable({
  properties: { protocol: true },
  define: {
    recieve: function(payload, path, stamp, subsHash, instanceId, source) {
      // we check if source is up or down security checks (this can be done later!)
      //have to know if this came from an upstream or downstream!
      //need to know instance
      if(path) {

      } else {
        var Event = require('vjs/lib/event')
        var event = new Event(this.parent, 'data')
        event.stamp = stamp
        this.parent.set(payload, event)
      }
    },
    send: function() {

    },
    connect: function() {
      // we can find the url in the .val of the upstream

    },
    disconnect: function() {

    }
  }
}).Constructor
