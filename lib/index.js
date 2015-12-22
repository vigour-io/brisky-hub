'use strict'
var Syncable = require('./syncable')

// temp fix allways db
Syncable.prototype.inject(require('./level'))

module.exports = new Syncable({
  inject: [
    require('./adapter'),
    require('./clients')
  ],
  ChildConstructor: 'Constructor'
}).Constructor
