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
            // console.log('??', data, typeof data === 'string')
            // console.log('incoming msg for the server', JSON.parse(data), this.path)
            this.parent.parent.recieve(data, connection)
          })
        })
      }
    }
  }
}
