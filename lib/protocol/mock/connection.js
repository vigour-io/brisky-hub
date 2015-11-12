'use strict'
var Connection = require('../connection')
module.exports = new Connection({
  define: {
    send () {
      console.log('lulz send it!')
    },
    recieve () {
      console.log('haha recieve dat')
    },
    connect () {
      console.log('haha connect dat')
    },
    disconnect () {
      console.log('haha disconnect dat')
    }
  }
}).Constructor
