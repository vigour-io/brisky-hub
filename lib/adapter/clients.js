'use strict'
var Observable = require('vigour-js/lib/observable/')

module.exports = new Observable({
  ChildConstructor: require('../client')
}).Constructor
