'use strict'
const WebSocketServer = require('uws').Server
const vstamp = require('vigour-stamp')
const offset = require('../../../offset/server') // better name
const client = require('../../../client/downstream')

module.exports = function createServer (hub, port) {
  const server = hub.downstream = new WebSocketServer({ port })
  server.on('connection', (socket) => {
    socket.on('message', (data) => {
      try {
        if (data) {
          data = JSON.parse(data)
          // needs more cleanup not complete yet
          if (data.type === 'clock') {
            // console.log('incoming clock')
            offset(data, socket)
            return
          }
          // console.log('incoming on server:', data, socket.context, socket.client)

          if (!data.client && !socket.client) {
            console.log('WRONG!')
          }

          if (data.client) { client(hub, data, socket) }
          const context = socket.context

          // stamp is wrong here
          context.set(data.state, false)
        } else {
          hub.emit('error', new Error('no payload from incoming message'))
        }
      } catch (e) {
        hub.emit('error', e)
      }
    })

    // also on context switch

    socket.on('close', () => {
      if (socket.client) {
        const stamp = vstamp.create('disconnect')
        socket.client.remove(stamp)
        vstamp.close(stamp)
      }
    })
  })

  return server
}
