'use strict'
const WebSocketServer = require('uws').Server
const vstamp = require('vigour-stamp')
const offset = require('../../../offset/server') // better name
const client = require('../client')

module.exports = function createServer (hub, port) {
  const server = hub.downstream = new WebSocketServer({ port })
  // NEEDS TO GO BUILD IN MEM LEAK
  server.connections = []

  server.on('connection', function (connection) {
    // first thing to make is CLIENT.ORIGIN very usefull
    server.connections.push(connection)

    connection.on('message', (data) => {
      try {
        if (data) {
          data = JSON.parse(data)
          if (data.type === 'clock') {
            offset(data, connection)
            return
          }
          if (data.client) { client(hub, data, connection) }
          const context = connection.context
          for (let stamp in data) {
            console.log(' \n :down-in', hub.id, '', stamp, data[stamp])
            context.set(data[stamp], stamp)
            vstamp.close(stamp)
          }
        } else {
          console.log('WTF NO PAYLOAD? --> find this', data)
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
