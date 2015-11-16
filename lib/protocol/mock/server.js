'use strict'
var serverList = require('./serverlist.js')
exports.server = {
  on: {
    data: {
      server (val, event) {
        serverList[val] = this
        this.on('request', (mock) => {
          console.log('ok do it?')
          let connection = new this.parent.Connection({ internal: mock }, event)
          mock.on('message', (data) => {
            this.parent.parent.receive(data, connection)
          })
        })
      }
    }
  }
}
