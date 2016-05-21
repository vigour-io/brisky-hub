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
        let connectStamp
        try {
          const payload = JSON.parse(data.utf8Data)
          if (payload.client) {
            if (connection.context) {
              // if (!connection.client) error!
              // can have multiple clients / contexts -- for multi clients (one hub to other)
              console.log('old context remove client there!, when no clients remove the whole thing')
            }
            let client = payload.client
            const ip = connection.remoteAddress
            const id = client.id
            const context = client.context || ip
            const parsed = vstamp.parse(client.stamp)
            connectStamp = vstamp.create(parsed.type, parsed.src || id, parsed.val)

            // ------------------------------
            // this can become a seperate function
            const instances = hub._i
            let createContext = true
            if (instances) {
              for (let i = 0, len = instances.length; i < len; i++) {
                if (instances[i].context.compute() === context) {
                  console.log('found context!')
                  hub = instances[i]
                  createContext = false
                  break
                }
              }
            }
            if (createContext) {
              console.log('CREATE CONTEXT', context)
              hub = new hub.Constructor({ context: context }, connectStamp)
            }
            // ------------------------------
            hub.set({ clients: { [id]: { id: id, ip: ip } } }, connectStamp)
            const hClient = hub.clients[id]
            hClient.ip._lstamp = vstamp.create('ip', hub.id)
            vstamp.close(connectStamp)
            hClient.connection = connection
            connection.client = hClient
            connection.context = hub
            if (client.subscriptions) {
              for (let i in client.subscriptions) {
                hub.subscribe(client.subscriptions[i], void 0, void 0, connectStamp, hub.clients[id])
              }
            }
            delete payload.client
          }

          if (!connection.context) {
            // or emit error on the hub
            // all error handling can then be listened to on top in the hub -- def best way
            throw new Error('no connection context -- need to put data in a queue -- seems smoeone is doing it wrong')
          } else {
            for (let stamp in payload) {
              hub.set(payload[stamp], stamp)
              vstamp.close(stamp)
            }
          }
        } catch (e) {
          console.log('some weird error on the server', data.utf8Data, e.stack)
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
