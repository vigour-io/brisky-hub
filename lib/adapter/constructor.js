'use strict'
var Observable = require('vigour-js/lib/observable')
// var Event = require('vigour-js/lib/event')
// downstream, upstream are property settings of adapter
// val is url (to hub)
// instanceID is also a thing for adapter (needs to be observable)
module.exports = new Observable({
  inject: [
    require('./parse'),
    require('./client'),
    require('./scope')
  ],
  listens: false
}).Constructor
// emits --- connected , disconnected
