'use strict'
var WsServer = require('websocket').server
exports.server = {
  inject: [
    require('../../http'),
    require('vigour-js/lib/operator/type')
  ],
  $type: 'number', // 2 options is also an option number or string?
  on: {
    data: {
      server (data, event) {
        if (data === null) {
          console.warn('server removed handle later')
          return
        }
        let val = this.val
        if (!val) {
          return
        }
        let server = new WsServer({httpServer: this.http.server(val)})
        server.on('request', (req) => {
          var wsServerConn = req.accept('hubs', req.origin)
          var connection = new this.parent.ServerConnection({ internal: wsServerConn })
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
