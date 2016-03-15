'use strict'
// custom error types!
// add error in vigour-util (reuse in api as well)
var WsServer = require('websocket').server
exports.server = {
  inject: [
    require('../../http')
  ],
  $type: 'number', // 2 options is also an option number or string?
  on: {
    data: {
      server (data, event) {
        if (data === null) {
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
              let obj
              try {
                obj = JSON.parse(data.utf8Data)
              } catch (e) {
                this.parent.parent.emit('error', 'receive: ws server: 💩    malformed incoming data')
                return
              }
              this._parent._parent.receive(obj, connection)
            } else if (data.type === 'binary') {
              // this.emit('data', {data: message.binaryData, connection: wsServerConn})
            }
          })
          wsServerConn.on('close', () => {
            connection.remove()
            // and remove client!
          })
        })
        server.on('error', function (err) {
          throw err
        })
      }
    }
  }
}
