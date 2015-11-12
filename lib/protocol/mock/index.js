'use strict'
var Protocol = require('../')
module.exports = new Protocol({
  define: {
    mockServers: { value: {} }
  },
  connections: {},
  Connection: require('./connection'),
  inject: [
    require('./server')
  ]
}).Constructor
