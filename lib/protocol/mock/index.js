'use strict'
var Protocol = require('./')

// connections? lets see!
module.exports = new Protocol({
  Connection: require('./connection'),
  define: {
    startServer (val, event) {
      console.log('start server bitchez!')
    }
  }
})
