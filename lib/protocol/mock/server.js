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
        this.on('request', (mock) => {
          let connection = new this.parent.Connection({ internal: mock }, event)
          connection.ip = ~~(Math.random() * 9999999)
          mock.on('message', (data) => {
            // 2 times for each context ofc
            this._parent._parent.receive(data, connection)
          })
          mock.on('close', function (data) {
            connection.remove()
          })
        })
      }
    }
  }
}
