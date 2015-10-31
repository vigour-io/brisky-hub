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

var runnin = false
exports.define = {
  startWebsocketServer (port) {
    if(runnin) return
    runnin = true
    var adapter = this

    if (adapter.websocketServer) {
      adapter.emit('error', '"websocket server is allready started -- not implemented yet ' + port + '"')
      return
    }

    var connection = new Connection(port, 'upstream')
    connection.on('listens', () => {
      adapter.emit('listens', 'websocket')
    })
    connection.on('data', (payload) => {
      adapter.parse(JSON.parse(payload.data), payload.connection)
    })
  }
}
