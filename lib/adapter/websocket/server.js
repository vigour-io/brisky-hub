var WebSocketServer = require('websocket').server
var http = require('http')

exports.listens = {
  on: {
    data: {
      websocket: function () {
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
      throw new Error('allready have a server on this guy -- need to handle this!')
    }

    var adapter = this

    var httpServer = http.createServer(function (request, response) {
      response.writeHead(404)
      response.end()
    })

    httpServer.listen(port, function () {
      console.log((new Date()) + ' Server is listening on port ' + port)
    })

    var server = this.websocketServer = new WebSocketServer({
      httpServer: httpServer
      // autoAcceptConnections: true
    })

    server.on('request', function (request) {
      var connection = request.accept('upstream', request.origin)
      connection.on('message', function (message) {
        adapter.parse(message, connection)
      })
      connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.')
      })
    })
  }
}

/*
server.on('request', function (request) {
  var connection = request.accept('connect', request.origin)
  console.log((new Date()) + ' Connection accepted.')
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      console.log('Received Message utf8: ' + message.utf8Data)
      connection.sendUTF(message.utf8Data)
    } else if (message.type === 'binary') {
      console.log('Received Binary Message of ' + message.binaryData.length + ' bytes')
      connection.sendBytes(message.binaryData)
    }
  })
  connection.on('close', function (reasonCode, description) {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.')
  })
})
 */
