'use strict'
var Connection = require('../connection')
module.exports = new Connection({
  upstream: {
    on: {
      value: {
        mock (data, event) {
          console.warn('Make upstream mock connection', this.val)
        }
      }
    }
  }
}).Constructor

// connection does not know shit about clients etc -- just a connection!
