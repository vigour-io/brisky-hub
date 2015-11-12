'use strict'
var Protocol = require('../')
// connections? lets see!
module.exports = new Protocol({
  connections: {},
  Connection: require('./connection'),
  inject: [
    require('./server')
  ]
}).Constructor
