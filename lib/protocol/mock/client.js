'use strict'
var mockServers = {}

exports.on = {
  value: {
    client (data, event) {
      console.log('connect!!!!', data)
    }
  }
}
