'use strict'
// call this client -- use the uws client for node when its done
const WsClient = require('websocket').w3cwebsocket
const vstamp = require('vigour-stamp')
const { ClocksyClient } = require('clocksy')
const incomingOffset = require('../offset/client').incoming
// need to find a really good way to offset from a source
module.exports = function connect (hub, url, reconnect) {
  const socket = new WsClient(url)
  const id = hub.id
  hub.set({ clients: { [id]: { id: id, socket } } }, false)
  hub.set({ client: hub.clients[id] }, false)

  hub.clients[id].sendMeta()

  hub.reconnect = null
  // find a good determinator for clock
  // need to find a way to correct queues
  // move this to offset as well
  const clocksy = new ClocksyClient({
    sendRequest: (req) => socket.send(JSON.stringify({
      type: 'clock', data: req
    }))
  })
  socket.onerror = () => socket.close()
  socket.onmessage = (data) => {
    data = JSON.parse(data.data)
    if (data) {
      if (data.type === 'clock') {
        incomingOffset(hub, socket, data, clocksy)
      } else {
        console.log('UP-INCOMING', id, data.state)
        // stamp is not nessecary
        hub.set({ loop: {} }, false)
        hub.set(data.state, false)
        for (var i in hub.loop) {
          vstamp.close(i)
        }
        hub.set({ loop: {} }, false)
        // if data.stamp
        // vstamp.close(data.stamp)
      }
    }
  }
  socket.onopen = () => {
    delete socket.offset
    clocksy.start()
  }
  socket.onclose = () => {
    clocksy.stop()
    if (vstamp.offsetConnection === socket) {
      delete vstamp.offsetConnection
    }
    if (hub.connected) {
      // blocking own src is a bit weird...
      const stamp = vstamp.create('disconnect', hub.id)
      hub.set({ connected: false }, stamp)
      vstamp.close(stamp)
      if (!socket.blockReconnect) {
        reconnect = Math.min((reconnect * 1.5) | 0, 2000)
        hub.reconnect = setTimeout(connect, reconnect, hub, url, reconnect)
      }
    }
  }
  hub.upstream = socket
}