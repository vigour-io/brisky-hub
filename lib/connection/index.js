'use strict'
var Observable = require('vjs/lib/observable')
var Protocol = require('../protocol')

// TODO add a way to order the connections so we can chose which one to use
// TODO add routes for servers
var Connection = new Observable({
  url: {
    on: {
      data: function () {
        
      }
    }
  }
})

Connection.define({
  send (payload) {
    console.log('Connection - send', payload)
  },
  connect (url) {
    console.log('Connection - connect', url)
  },
  disconnect (data, event) {
    console.log('Connection - disconnect')
  }
})

module.exports = Connection.Constructor
