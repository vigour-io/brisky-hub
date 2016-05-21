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
        const hub = this.cParent()
        const val = this.compute()
        if (hub.downstream) {
          closeServer(hub.downstream)
          hub.downstream = null
        }
        if (val) {
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
  server._httpServer.close()
}

function server (hub, port) {
  let httpServer = http.createServer().listen(port)
  let server = hub.downstream = new WsServer({
    httpServer: httpServer
  })
  server._httpServer = httpServer
  server.on('request', (req) => {
    const connection = req.accept('hubs', req.origin)
    connection.on('message', (data) => {
      if (data.type === 'utf8') {
        try {
          const payload = JSON.parse(data.utf8Data)
          if (payload.client) {
            if (connection.context) {
              // if (!connection.client) error!
              // can have multiple clients / contexts -- for multi clients (one hub to other)
              console.log('old context remove client there!, when no clients remove the whole thing')
            }
            let client = payload.client
            let id = client.id
            hub.set({
              clients: {
                [id]: {
                  id: id,
                  ip: connection.remoteAddress
                }
              }
            })
            connection.client = hub.clients[id]
            connection.context = hub
            delete payload.client
          }

          // only set when its ok to set -- else add the sets to a queue object
          if (!connection.context) {
            console.log('no connection context -- need to put data in a queue -- seems smoeone is doing it wrong')
          } else {
            for (let stamp in payload) {
              hub.set(payload[stamp], stamp)
              vstamp.close(stamp)
            }
          }
        } catch (e) {
          console.log('some weird error on the server', data.utf8Data, e)
        }
      }
    })
    connection.on('close', () => {
      const stamp = vstamp.create('disconnect', connection.client.id.compute())
      connection.client.remove(stamp)
      vstamp.close(stamp)
    })
  })
  return server
}
