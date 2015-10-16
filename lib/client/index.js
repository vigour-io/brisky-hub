'use strict'
var Observable = require('../observable')
module.exports = new Observable({
  properties: {
    connection: true
  },
  ChildConstructor: 'Constructor'
}).Constructor

// connection moet shit doen
