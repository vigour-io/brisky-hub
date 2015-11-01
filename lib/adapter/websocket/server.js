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

    var connection = new Connection(port, 'upstream')
    connection.on('listens', () => {
      adapter.emit('listens', 'websocket')
    })
    connection.on('data', (payload) => {
      // console.log('--ONDATA')
      // console.log('payload', payload)
      adapter.parse(JSON.parse(payload.data), payload.connection)
    })
    connection.on('close', function(data) {
      adapter.parent.clients[data.client].remove()
    })
  }
}
