var webSocket = require('websocket')

exports.properties = {
  server: true
}

exports.listens = {
  on: {
    data: {
      websocket: function () {
        this.parent.server = this.parent.startServer(this.val)
      }
    }
  }
}

exports.define = {
  startServer (port) {
    var WebSocketServer = webSocket.server
    var http = require('http')

    if (this.server) {
      throw new Error('allready have a server on this guy -- need to handle this!')
    }

    var httpServer = http.createServer(function (request, response) {
      response.writeHead(404)
      response.end()
    })

    httpServer.listen(port, function () {
      console.log((new Date()) + ' Server is listening on port ' + port)
    })

    return new WebSocketServer({
      httpServer: httpServer,
      autoAcceptConnections: true
    })
  }
}
