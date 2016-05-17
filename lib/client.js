'use strict'
const Sync = require('./sync')

// do we store thing on client -- e.g key allways has to be id
module.exports = new Sync({
  type: 'client' // this notation since you want it to have type 'client'
}, false).Constructor
