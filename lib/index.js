'use strict'
var Syncable = require('./syncable')
module.exports = new Syncable({
  inject: [
    require('./adapter'),
    require('./clients')
  ],
  ChildConstructor: 'Constructor'
}).Constructor
