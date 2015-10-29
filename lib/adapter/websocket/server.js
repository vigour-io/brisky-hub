var WebSocketServer = require('websocket').server
var http = require('http')
var Connection = require('./connection')

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
    var adapter = this

    if (adapter.websocketServer) {
      adapter.emit('error', '"websocket server is allready started -- not implemented yet ' + port + '"')
      return
    }

    var connection = new Connection()
    connection.listen(port, 'upstream')
    connection.on('listens', () => {
      adapter.emit('listens', 'websocket')
    }).on('data-string', (data, conn) => {
      adapter.parse(JSON.parse(data), conn)
    })
  }
}
