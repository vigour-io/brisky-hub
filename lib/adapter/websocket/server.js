var webSocket = require('websocket')

exports.start = function () {
  var WebSocketServer = webSocket.server
  var http = require('http')

  var httpServer = http.createServer(function (request, response) {
    console.log((new Date()) + ' Received request for ' + request.url)
    response.writeHead(404)
    response.end()
  })

  httpServer.listen(3030, function () {
    console.log((new Date()) + ' Server is listening on port 8080')
  })

  var server = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true
  })
}
