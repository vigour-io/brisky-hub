'use strict'
// this is the constructor
var Observable = require('vjs/lib/observable')
Observable.prototype.inject(require('vjs/lib/methods/plain'))

// hub and thats that instances need keys!
module.exports = new Observable({
  inject: [
    require('./adapter'),
    require('./on'),
    require('vjs/lib/methods/lookup')
  ]
}).Constructor
