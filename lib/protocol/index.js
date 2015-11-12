'use strict'
var Observable = require('vigour-js/lib/observable')
// server, connections, connection (Class!)
var Protocol = new Observable({
  properties: {
    Connection: true
  }
})
module.exports = Protocol.Constructor
