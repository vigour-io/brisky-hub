'use strict'
var Observable = require('vjs/lib/observable')

module.exports = new Observable({
  inject: [
    require('vjs/lib/methods/setWithPath'),
    require('vjs/lib/methods/serialize'),
    require('vjs/lib/methods/map'),
    require('./on')
  ],
  ChildConstructor: 'Constructor'
}).Constructor
