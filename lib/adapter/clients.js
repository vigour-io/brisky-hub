'use strict'
var Observable = require('../observable/')

module.exports = new Observable({
  ChildConstructor: require('../client')
  // sepcial stuff for instances (only loop trough hasOwnProps for example)
  // ip is the exception (you can subscribe on any client basicly, need to be able to set something in instance in subs?)
  // keep this as open as possiblf
}).Constructor
