'use strict'
var serverList = require('./serverlist.js')
var Emitter = require('vigour-js/lib/emitter')

exports.server = {
  on: {
    properties: {
      request: new Emitter({
        emitInstances: false,
        emitContexts: false
      })
    },
    data: {
      server (val, event) {
        serverList[val] = this
        // console.log('listen????')
        this.on('request', (mock) => {
          let connection = new this.parent.ServerConnection({ internal: mock }, event)
          connection.ip = ~~(Math.random() * 9999999)
          mock.on('message', (data) => {
            this._parent._parent.receive(JSON.parse(JSON.stringify(data)), connection)
          })
          mock.on('close', function (data) {
            connection.remove()
          })
        })
      }
    }
  }
}
