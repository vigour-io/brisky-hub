'use strict'
var Protocol = require('../')
var Connection = require('./connection')

module.exports = new Protocol({
  type: 'protocol',
  Connection: Connection,
  ServerConnection: new Connection({
    define: {
      push (data) {
        this.send(data)
      }
    }
  }).Constructor,
  inject: [
    require('./server')
  ]
}).Constructor
