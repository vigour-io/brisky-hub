'use strict'
var Syncable = require('./syncable')

// temp fix allways db
module.exports = new Syncable({
  inject: [
    require('./adapter'),
    require('./clients'),
    require('./level')
  ],
  ChildConstructor: 'Constructor'
}).Constructor
