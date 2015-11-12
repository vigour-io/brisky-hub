'use strict'
var mockServers = {}

exports.server = {
  on: {
    data: {
      server (val, event) {
        mockServers[val] = this
        console.log('start server!', val)
      }
    }
  }
}
