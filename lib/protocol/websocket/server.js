'use strict'
// var Emitter = require('vigour-js/lib/emitter')
var WsServer = require('websocket').server
var http = require('http')

exports.server = {
  on: {
    data: {
      server (val, event) {
        var httpServer = http.createServer(function (req, res) {
          res.end('HUBZZZZ make some nice things here')
        }).listen(val)

        var server = new WsServer({
          httpServer: httpServer
        })

        server.on('request', (req) => {
          console.log('on request?')
          console.log('bitch true connection', '???', req)
          var wsServerConn = req.accept('hubs', req.origin)
          var connection = new this.parent.Connection({ internal: wsServerConn })
          connection.ip = ~~(Math.random() * 9999999)
          wsServerConn.on('message', (data) => {
            console.log('bitch true mezzg', data)
            if (data.type === 'utf8') {
              this._parent._parent.receive(JSON.parse(data.utf8Data), connection)
            } else if (data.type === 'binary') {
              // this.emit('data', {data: message.binaryData, connection: wsServerConn})
            }
          })

          wsServerConn.on('close', () => {
            console.log('murderous close!')
            connection.remove()
          })
        })
      }
    }
  }
}
