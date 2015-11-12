'use strict'
var Protocol = require('../')
// connections? lets see!
module.exports = new Protocol({
  Connection: require('./connection'),
  inject: [
    require('./server'),
    require('./client')
  ]
}).Constructor
