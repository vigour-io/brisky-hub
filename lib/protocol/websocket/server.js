'use strict'
// var Emitter = require('vigour-js/lib/emitter')
var WsServer = require('websocket').server
// exports.inject = require('')

exports.server = {
  inject: require('../http'),
  on: {
    data: {
      server (val, event) {
        var server = new WsServer({ httpServer: this.http.server(val) })
        server.on('request', (req) => {
          var wsServerConn = req.accept('hubs', req.origin)
          var connection = new this.parent.Connection({ internal: wsServerConn })
          connection.ip = wsServerConn.remoteAddress
          wsServerConn.on('message', (data) => {
            if (data.type === 'utf8') {
              this._parent._parent.receive(JSON.parse(data.utf8Data), connection)
            } else if (data.type === 'binary') {
              // this.emit('data', {data: message.binaryData, connection: wsServerConn})
            }
          })
          wsServerConn.on('close', () => {
            connection.remove()
          })
        })
      }
    }
  }
}
