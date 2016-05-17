'use strict'
const Sync = require('./sync')

// nested fields need to synced but client it self does not need to be synced up
module.exports = new Sync({
  type: 'client',
  syncUp: false
  // this will sync down -- may be confusing -- dont want to send connected info down
}, false).Constructor
