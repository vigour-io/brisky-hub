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
      var contextHub
      if (data.type === 'utf8') {
        let connectStamp
        try {
          const payload = JSON.parse(data.utf8Data)
          if (payload) {
            if (payload.client) {
              const client = payload.client
              const id = client.id
              if (connection.client && connection.client.key === id) {
                console.log('allready have client -- RECONN')
              }

              if (connection.context && connection.context !== payload.client.context) {
                // if (!connection.client) error!
                // can have multiple clients / contexts -- for multi clients (one hub to other)
                console.log('old context remove client there!, when no clients remove the whole thing')
              }
              const ip = connection.remoteAddress
              let context = client.context
              if (context === void 0) {
                context = ip
              }
              const parsed = vstamp.parse(client.stamp)
              connectStamp = vstamp.create(parsed.type, parsed.src || id, parsed.val)

              // ------------------------------
              // this can become a seperate function
              if (context === false) {
                contextHub = hub
              } else {
                const instances = hub._i
                let createContext = true
                if (instances) {
                  for (let i = 0, len = instances.length; i < len; i++) {
                    if (instances[i].context.compute() === context) {
                      contextHub = instances[i]
                      createContext = false
                      break
                    }
                  }
                }
                if (createContext) {
                  console.log('CREATE CONTEXT', context)
                  contextHub = new hub.Constructor({ context: context }, connectStamp)
                }
              }
              // ------------------------------
              contextHub.set({ clients: { [id]: { id: id, ip: ip } } }, connectStamp)
              const hClient = contextHub.clients[id]
              hClient.ip.stamp = vstamp.create('ip', contextHub.id)
              vstamp.close(connectStamp)
              hClient.connection = connection
              connection.client = hClient
              console.log('create dat context')
              connection.context = contextHub
              if (client.subscriptions) {
                console.log(' ok ok do it', client.subscriptions)
                for (let i in client.subscriptions) {
                  contextHub.subscribe(client.subscriptions[i], void 0, void 0, connectStamp, contextHub.clients[id])
                }
              }
              delete payload.client
            }

            if (!connection.context) {
              // or emit error on the hub
              // all error handling can then be listened to on top in the hub -- def best way
              throw new Error('no connection context -- need to put data in a queue -- seems smoeone is doing it wrong')
            } else {
              contextHub = connection.context
              // batch?
              // console.log('INCOMING!', Object.keys(payload))
              for (let stamp in payload) {
                contextHub.set(payload[stamp], stamp)
                vstamp.close(stamp)
              }
            }
          } else {
            console.log('WTF NO PAYLOAD?', payload)
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
