'use strict'
var Observable = require('vigour-js/lib/observable')
// server, connections, connection (Class!)
module.exports = new Observable({
  properties: {
    Connection: true
  },
  useVal: true
}).Constructor
