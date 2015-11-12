'use strict'
var Connection = require('../connection')
module.exports = new Connection({
  upstream: {
    on: {
      value: {
        mock (data, event) {
          console.warn('Make upstream connection', this.val)
        }
      }
    }
  }
}).Constructor
