'use strict'
var Observable = require('vjs/lib/observable')
var Event = require('vjs/lib/event')

module.exports = new Observable({
  properties: { protocol: true },
  define: {
    recieve (payload, path, stamp, subsHash, instanceId, source) {

    },
    parse (message) {

    },
    send () {

    },
    connect () {
      // we can find the url in the .val of the upstream

    },
    disconnect () {

    }
  }
}).Constructor
