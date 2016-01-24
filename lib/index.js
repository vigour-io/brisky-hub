'use strict'
var Syncable = require('./syncable')

// temp fix allways db
module.exports = new Syncable({
  inject: [
    require('./adapter'),
    require('./clients')
  ],
  autoRemoveScopes: false, //TEMP!
  ChildConstructor: 'Constructor'
}).Constructor
