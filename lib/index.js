'use strict'
// this is the constructor
var Observable = require('vjs/lib/observable')

// hub and thats that instances need keys!

module.exports = new Observable({
  inject: [
    require('./upstream'),
    require('./on'),
    require('vjs/lib/methods/lookup')
  ]
}).Constructor
