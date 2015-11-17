'use strict'
var serverList = require('./serverlist.js')
var Event = require('vigour-js/lib/event')
exports.server = {
  on: {
    data: {
      server (val, event) {
        serverList[val] = this
        this.on('request', (mock) => {
          let connection = new this.parent.Connection({ internal: mock }, event)
          mock.on('message', (data) => {
            this.parent.parent.receive(data, connection)
          })
          mock.on('close', function (data, event) {
            var event = new Event(connection, 'data')
            connection.remove(event)
          })
        })
      }
    }
  }
}
