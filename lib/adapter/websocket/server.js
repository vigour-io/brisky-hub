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
    runnin = true
    // this is dirty stuff! temp will have to change!
    // now its impossible to change the protocl/server youre using to listen
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
        message (payload) {
          adapter.parse(JSON.parse(payload.data), payload.connection)
        },
        close (data) {
          if (data && data.client) {
            adapter.parent.clients[data.client].remove()
          }
        }
      }
    })
    connection.set({port: port, secret: 'upstream'})
  }
}
