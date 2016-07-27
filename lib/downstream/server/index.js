'use strict'
const WebSocketServer = require('uws').Server
const { ClocksyServer } = require('clocksy')
const clocksy = new ClocksyServer()
// const WsServer = require('websocket').server
// const http = require('http')
const vstamp = require('vigour-stamp')

function clock (data, connection) {
  if (data.type && data.type === 'clock') {
    connection.send(JSON.stringify({
      type: 'clock',
      data: clocksy.processRequest(data.data)
    }))
  }
}

module.exports = function server (hub, port) {
  // let httpServer = http.createServer().listen(port)
  // let server = hub.downstream = new WsServer({
  //   httpServer: httpServer
  // })
  // server._httpServer = httpServer

  const server = hub.downstream = new WebSocketServer({
    port
  })

  // console.log('start')
  // server.on('connection', function (ws) {
  //   console.log('hello?')
  //   ws.on('message', function (message) {
  //     console.log('received: ' + message)
  //   })
  // })
  server.connections = []

  server.on('connection', function (connection) {
    server.connections.push(connection)
    // needs to loop torugh client .origin if you want this killed

    connection.on('message', (payload) => {
      // console.log(payload)
      var contextHub
      let connectStamp
      try {
        if (payload) {
          payload = JSON.parse(payload)
          if (payload.type === 'clock') {
            // console.log('yo yo yo')
            clock(payload, connection)
            return
          }

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
              // switching contexts pretty important fix it
            }
            const ip = connection.remoteAddress
            let context = client.context
            const parsed = vstamp.parse(client.stamp)
            connectStamp = vstamp.create(parsed.type, parsed.src || id, parsed.val)

            // ------------------------------
            if (context === void 0) {
              context = ip
            }
            if (context === false) {
              contextHub = hub
            } else {
              contextHub = hub.getContext(context)
              if (!contextHub) {
                contextHub = new hub.Constructor({ context: context }, connectStamp)
              }
            }
            // ------------------------------
            // needs to be better best is too know if its upstrem
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
            throw new Error('no connection context -- need to put data in a queue -- seems smoeone is doing it wrong')
          } else {
            contextHub = connection.context
            for (let stamp in payload) {
              contextHub.set(payload[stamp], stamp)
              vstamp.close(stamp)
            }
          }
        } else {
          console.log('WTF NO PAYLOAD? --> find this', payload)
        }
      } catch (e) {
        console.log('some weird error on the server', e)
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
