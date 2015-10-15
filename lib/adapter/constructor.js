'use strict'
var Observable = require('vjs/lib/observable')

module.exports = new Observable({
  properties: { protocol: true },
  define: {
    subscribe: function (pattern, path, stamp) {

      //we need to queue always
      console.error('xxxx')
      this.protocol.subscribe.call(this, pattern, path, stamp)
    },
    receive: function(payload, path, stamp, subsHash) {
      if(path) {

      } else {
        var Event = require('vjs/lib/event')
        var event = new Event(this.parent.parent, 'data')
        event.stamp = stamp
        this.parent.parent.set(payload, event)
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
