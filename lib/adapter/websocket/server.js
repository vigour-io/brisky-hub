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
    if (!this._parent.clients) {
      this._parent.set({clients: {}})
    }
    var adapter = this
    if (adapter.websocketServer) {
      adapter.emit('error', '"websocket server is allready started -- not implemented yet ' + port + '"')
      return
    }
    var connection = new Connection()
    connection.listen(port, 'upstream')
    connection.on('listens', () => {
      adapter.emit('listens', 'websocket')
    })
    connection.on('message', (data) => {
      // console.log(data)
      adapter.parse(JSON.parse(data), connection)
    })
    connection.on('close', function (data) {
      if (connection.client) {
        // connection.client.remove()
      }
    })
  }
}
