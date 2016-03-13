'use strict'
var Syncable = require('./syncable')

module.exports = new Syncable({
  type: 'hub',
  inject: [
    require('./adapter'),
    require('./clients')
  ],
  Child: 'Constructor'
}).Constructor
