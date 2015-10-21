'use strict'

global.currentStatus = {}

var Observable = require('./Observable')

module.exports = new Observable({
  inject: require('./adapter'),
  ChildConstructor: 'Constructor'
}).Constructor
