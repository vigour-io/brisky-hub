'use strict'
var Observable = require('./Observable')
// hub and thats that instances need keys!
module.exports = new Observable({
  inject: require('./adapter'),
  properties: {
    clients: new Observable({
      ChildConstructor: require('./client')
    })
  },
  ChildConstructor: 'Constructor'
}).Constructor


console.warn(module.exports.prototype.clients)

/*
  child constructor so each nested field can have its own adapter and clients
  adapter takes care of unstances
 */
