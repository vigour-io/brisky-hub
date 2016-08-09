'use strict'
const WebSocketServer = require('uws').Server
const vstamp = require('vigour-stamp')
const offset = require('../../../offset/server') // better name
const client = require('../client')

module.exports = function createServer (hub, port) {
  const server = hub.downstream = new WebSocketServer({ port })
  server.on('connection', function (connection) {
    connection.on('message', (data) => {
      try {
        if (data) {
          data = JSON.parse(data)

          // needs more cleanup not complete yet
          if (data.type === 'clock') {
            offset(data, connection)
            return
          }

          console.log('do it --->', data)

          if (data.client) { client(hub, data, connection) }
          const context = connection.context
          for (let stamp in data) {
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
        const stamp = vstamp.create('disconnect')
        connection.client.remove(stamp)
        vstamp.close(stamp)
      }
    })
  })

  return server
}
