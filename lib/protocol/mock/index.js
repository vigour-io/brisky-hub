'use strict'
var Protocol = require('../')

module.exports = new Protocol({
  Connection: require('./connection'),
  inject: [
    require('./server')
  ]
}).Constructor
