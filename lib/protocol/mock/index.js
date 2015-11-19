'use strict'
var Protocol = require('../')

module.exports = new Protocol({
  connections: {},
  Connection: require('./connection'),
  inject: [
    require('./server')
  ]
}).Constructor
