'use strict'
const Sync = require('../sync')
// may need to handle this after all on remove connection
// nested fields need to synced but client it self does not need to be synced up
module.exports = new Sync({
  type: 'client',
  define: {
    isClient: { value: true }
  },
  properties: {
    socket: true
  }
  // tombstone: false
}, false).Constructor
