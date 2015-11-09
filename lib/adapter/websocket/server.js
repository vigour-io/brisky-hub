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
    var connection = new Connection({
      on: {
        listens () {
          adapter.emit('listens', 'websocket')
        },
        data (data) {
          adapter.parse(JSON.parse(data), this)
        },
        close (data) {
          if (data && data.client) {
            adapter.parent.clients[data.client].remove()
          }
        }
      }
    })
    connection.listen(port, 'upstream')
  }
}
