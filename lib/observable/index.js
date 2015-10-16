'use strict'
var Observable = require('vjs/lib/observable')

module.exports = new Observable({
  inject: [
    require('vjs/lib/methods/setWithPath'),
    require('./on')
  ],
  ChildConstructor: 'Constructor'
}).Constructor
