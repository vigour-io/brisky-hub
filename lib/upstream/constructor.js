'use strict'
var Observable = require('vjs/lib/observable')

module.exports = new Observable({
  inject: require('../adapter')
}).Constructor
