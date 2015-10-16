'use strict'
var Observable = require('vjs/lib/observable')
var Event = require('vjs/lib/event')


// downstream, upstream are property settings of adapter
// val is url (to hub)
// instanceID is also a thing for adapter (needs to be observable)
//

module.exports = new Observable({
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
  },
  listens: false
}).Constructor
