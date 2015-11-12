'use strict'
var Observable = require('vigour-js/lib/observable')
var Syncable = require('./syncable')
module.exports = new Syncable({
  properties: {
    clients: new Observable({
      ChildConstructor: require('./client')
    }).Constructor
  },
  inject: require('./adapter'),
  ChildConstructor: 'Constructor'
}).Constructor
