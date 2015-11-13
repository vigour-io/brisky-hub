'use strict'
var serverList = require('./serverlist.js')
exports.server = {
  on: {
    data: {
      server (val, event) {
        console.log('start server!', val)
        serverList[val] = this
        this.on('request', (mock) => {
          console.log('client connects!')
          let connection = new this.parent.Connection({
            internal: mock
          }, event) // do not need to store
          mock.on('message', (data) => {
            console.log('incoming msg server', data)
            this.parent.parent.recieve(data, connection)
          })
        })
      }
    }
  }
}
