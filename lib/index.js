'use strict'
var Observable = require('./Observable')

module.exports = new Observable({
  inject: require('./adapter'),
  ChildConstructor: 'Constructor'
}).Constructor
