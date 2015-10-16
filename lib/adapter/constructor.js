'use strict'
var Observable = require('vjs/lib/observable')
// var Event = require('vjs/lib/event')

// downstream, upstream are property settings of adapter
// val is url (to hub)
// instanceID is also a thing for adapter (needs to be observable)

module.exports = new Observable({
  properties: {
    client: require('./client')
  },
  inject: [
    require('./parse')
  ],
  listens: false
}).Constructor

// emits --- connected , disconnected
