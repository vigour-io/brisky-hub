'use strict'
var Observable = require('vjs/lib/observable')
Observable.prototype.inject(require('vjs/lib/methods/serialize'))

module.exports = new Observable({
  inject: [
    require('vjs/lib/methods/setWithPath'),
    require('vjs/lib/methods/serialize'),
    require('vjs/lib/methods/map'),
    require('vjs/lib/methods/keys'),
    require('vjs/lib/methods/toString'),
    require('./on'),
    require('./scope')
  ],
  ChildConstructor: 'Constructor'
}).Constructor
