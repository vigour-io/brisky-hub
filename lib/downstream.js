'use strict'
const WsServer = require('websocket').server
const http = require('http')
// const isEmpty = require('vigour-util/is/empty')
const vstamp = require('vigour-stamp')

exports.properties = {
  downstream: true,
  port: {
    type: 'observable',
    on: {
      data () {
        console.log('lullz port -- create a server!')
        const hub = this.cParent()
        const val = this.compute()
        if (hub.downstream) {
          closeServer(hub.downstream)
          hub.downstream = null
        }
        if (val) {
          console.log('create server port:', val)
          server(hub, val)
        }
      }
    }
  }
}

function closeServer (server) {
  const connections = server.connections
  for (var i in connections) {
    connections[i].close()
  }
  server._httpNest.close()
}

function server (hub, port) {
  let httpServer = http.createServer().listen(port)
  let server = hub.downstream = new WsServer({
    httpServer: httpServer
  })
  server._httpNest = httpServer
  server.on('request', (req) => {
    const connection = req.accept('hubs', req.origin)
    connection.on('message', (data) => {
      var payload
      if (data.type === 'utf8') {
        try {
          payload = JSON.parse(data.utf8Data)
          if (payload.subscription) {
            // hub.subscribe(payload.subscription, void 0, void 0, void 0, void 0, id)
          }
          if (payload.data) {
            payload.stamp = payload.stamp
            hub.set(payload.data, payload.stamp)
            vstamp.close(payload.stamp)
          }
        } catch (e) {
          console.log('some weird error on the server', data.utf8Data, e.stack)
        }
      }
    })
    connection.on('close', () => {
      console.log('client dc -- remove the client (and that one its context when applicable)')
    })
  })
  return server
}
