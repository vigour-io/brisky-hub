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
    if (runnin) return
    runnin = true // this is dirty stuff! temp will have to change!
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
    connection.on('data', (payload) => {
      console.log('are we here?', payload.data)
      adapter.parse(JSON.parse(payload.data), payload.connection)
    })
    connection.on('close', function (data) {
      if (data && data.client) {
        adapter.parent.clients[data.client].remove()
      }
    })
  }
}
