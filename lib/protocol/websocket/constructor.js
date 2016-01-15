'use strict'
var Protocol = require('../')
var Connection = require('./connection')

module.exports = new Protocol({
  Connection: Connection,
  ServerConnection: new Connection({
    define: {
      push (data) {
        console.log('out--->', data.stamp)
        this.send(data)
      }
    }
  }).Constructor,
  inject: [
    require('./server')
  ]
}).Constructor
