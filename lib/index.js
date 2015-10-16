'use strict'
var Observable = require('./Observable')
// hub and thats that instances need keys!
module.exports = new Observable({
  inject: require('./adapter'),
  ChildConstructor: 'Constructor'
}).Constructor

/*
  child constructor so each nested field can have its own adapter and clients
  adapter takes care of unstances
 */
