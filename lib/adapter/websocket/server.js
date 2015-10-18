var WebSocketServer = require('websocket').server
var http = require('http')

exports.listens = {
  on: {
    data: {
      websocket () {
        this.parent.startWebsocketServer(this.val)
      }
    }
  }
}

exports.properties = {
  websocketServer: true
}

exports.define = {
  startWebsocketServer (port) {
    if (this.websocketServer) {
      console.log(adapter.path.join(' -> ') + '"websocket server is allready started -- not implemented yet ' + port + '"')
      return
    }
    var adapter = this

    var httpServer = http.createServer(function (request, response) {
      response.writeHead(404)
      response.end()
    })

    httpServer.listen(port, function () {
      adapter.emit('listens', 'websocket')
    })

    var server = this.websocketServer = new WebSocketServer({
      httpServer: httpServer
    })

    server.on('request', function (request) {
      var connection = request.accept('upstream', request.origin)
      connection.on('message', function (message) {
        if (message.type === 'utf8') {
          adapter.parse(JSON.parse(message.utf8Data), connection)
        }
      })
      connection.on('close', function (reasonCode, description) {
        // clients my need a small delay before actually launching a disconnect
        if (!connection.client) {
          console.error(adapter.path, ' websocket close connection --- no client')
        } else {
          connection.client.remove()
        }
      })
    })
  }
}
