'use strict'
var Protocol = require('./')

module.exports = new Protocol({
  Connection: require('./connection'),
  define: {
    // this logic will be in adapter!
    startServer (val, event) {
      console.log('start server bitchez!')
    }
  }
})
