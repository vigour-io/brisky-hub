'use strict'
var Observable = require('vigour-js/lib/observable')
// rename this observable! its just hub
var Syncable = require('./syncable')
module.exports = new Syncable({
  inject: require('./adapter'),
  properties: {
    clients: new Observable({
      ChildConstructor: require('./client')
    }).Constructor
  },
  ChildConstructor: 'Constructor'
}).Constructor
