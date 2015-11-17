'use strict'
var serverList = require('./serverlist.js')
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
          mock.on('close', function (data) {
            connection.remove()
          })
        })
      }
    }
  }
}
