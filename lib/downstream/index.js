'use strict'
const WsServer = require('websocket').server
const http = require('http')
const vstamp = require('vigour-stamp')
const { ClocksyServer } = require('clocksy')
const clocksy = new ClocksyServer()

exports.properties = {
  downstream: true,
  port: {
    type: 'observable',
    noContext: true,
    on: {
      data () {
        if (!this.parent.context) {
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
}

exports.on = {
  remove: {
    port () {
      if (this.hasOwnProperty('port')) {
        this.port.set(null)
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
          let payload = JSON.parse(data.utf8Data)
          // baseline clock (from a clock hub or something)
          if (payload.type && payload.type === 'clock') {
            connection.send(JSON.stringify({
              type: 'clock',
              data: clocksy.processRequest(payload.data)
            }))
          }
        } catch (e) {
          console.log('errror', e)
        }
      }
    })

    connection.on('message', (data) => {
      var contextHub
      if (data.type === 'utf8') {
        let connectStamp
        try {
          const payload = JSON.parse(data.utf8Data)
          if (payload) {
            if (payload.type === 'clock') {
              return
            }

            if (payload.offset === void 0) {
              console.log('need dat offset!', payload)
            }

            // make a nicer threshold
            const offset = payload.offset && payload.offset > 10 || payload.offset < -10 ? payload.offset : 0
            delete payload.offset

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
              if (context === false) {
                contextHub = hub
              } else {
                contextHub = hub.getContext(context)
                if (!contextHub) {
                  contextHub = new hub.Constructor({ context: context }, connectStamp)
                }
              }
              // ------------------------------
              contextHub.set({ clients: { [id]: { id: id, ip: ip } } }, connectStamp)
              const hClient = contextHub.clients[id]
              hClient.ip.stamp = vstamp.create('ip', contextHub.id) // no need to close
              vstamp.close(connectStamp)
              hClient.connection = connection
              connection.client = hClient
              connection.context = contextHub
              if (client.subscriptions) {
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
              // console.log('incoming --', JSON.stringify(payload, false, 2))
              for (let stamp in payload) {
                let parsed = vstamp.parse(stamp)
                let s = vstamp.create(parsed.type, parsed.src, Number(parsed.val) + Number(offset))
                contextHub.set(payload[stamp], s)
                vstamp.close(s)
              }
            }
          } else {
            console.log('WTF NO PAYLOAD? --> find this', payload)
          }
        } catch (e) {
          // of course this try catch makes everyhting slow..
          // use node arg
          // emit all errors on hub root -- also for context
          console.log('some weird error on the server', e)
          console.log('incoming --- ', data.utf8Data, data)
        }
      }
    })
    connection.on('close', () => {
      if (connection.client) {
        const stamp = vstamp.create('disconnect', connection.client.get('id', false).compute())
        connection.client.remove(stamp)
        vstamp.close(stamp)
      }
    })
  })
  return server
}
