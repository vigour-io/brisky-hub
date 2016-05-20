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
            console.log('CLIENT!!!')
            if (connection.context) {
              // can have multipel clients / contexts will do that later
              console.log('old context remove client there!, when no clients remove the whole thing')
            }
            let client = payload.client
            let id = client.id
            // allways send client intial info
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

            console.log('here client info!')
            console.log('now we can do shit to the connection', client.id)
            console.log('now we can create some context', client.context)
            console.log('now we can subscribe', client.subscription)
            delete payload.client
          }

          // only set when its ok to set -- else add the sets to a queue object
          if (!connection.context) {
            console.log('no connection context -- need to put data in a queue -- seems very wrong')
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
      // make stamp
      connection.client.remove()
      // console.log('DOWNSTREAM: client dc -- remove the client (and that ones context -- this will be the name for scope, when applicable)')
    })
  })
  return server
}
