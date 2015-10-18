'use strict'
var Observable = require('vjs/lib/observable')

module.exports = new Observable({
  inject: [
    require('vjs/lib/methods/setWithPath'),
    require('vjs/lib/methods/serialize'),
    require('vjs/lib/methods/map'),
    require('vjs/lib/methods/keys'),
    // require('vjs/lib/methods/plain'), //need to add in vjs
    require('vjs/lib/methods/toString'),
    require('./on')
  ],
  ChildConstructor: 'Constructor'
}).Constructor
