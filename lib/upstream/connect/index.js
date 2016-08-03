'use strict'
// call this client -- use the uws client for node when its done
// make a browser shim for it

const WsClient = require('websocket').w3cwebsocket
const vstamp = require('vigour-stamp')
const { ClocksyClient } = require('clocksy')

// need to find a really good way to offset from a source
// this is a bit dangerous

module.exports = function connect (hub, url, reconnect) {
  const socket = new WsClient(url)
  const id = hub.id
  hub.set({ clients: { [id]: { id: id } } }, false)
  hub.set({ client: hub.clients[id] }, false)
  hub.reconnect = null
  // find a good determinator for clock
  // need to find a way to correct queues
  const clocksy = new ClocksyClient({
    sendRequest: (req) => socket.send(JSON.stringify({
      type: 'clock', data: req
    }))
  })
  socket.onerror = () => {
    socket.close()
  }
  socket.onmessage = (data) => {
    data = JSON.parse(data.data)
    if (data && data.type === 'clock') {
      // there is a bit more to this since we need to offset from an origin
      // (double offset) -- maybe dont use clocksy
      const tDelta = clocksy.processResponse(data.data)
      if (socket.offset === void 0) {
        if (!vstamp.offsetConnection) {
          vstamp.offsetConnection = socket
        }
        socket.offset = tDelta
        const stamp = vstamp.create('connect')
        hub.set({ connected: true }, stamp)
        vstamp.close(stamp)
      } else {
        socket.offset = tDelta
      }
      if (vstamp.offsetConnection === socket) {
        vstamp.offset = Math.abs(tDelta) > 10 ? tDelta : 0
      }
    } else {
      // pass connection as well?
      hub.set(data.state, data.stamp)
      vstamp.close(data.stamp)
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
      const stamp = vstamp.create('disconnect')
      hub.set({ connected: false }, stamp)
      vstamp.close(stamp)
      if (!socket.blockReconnect) {
        reconnect = Math.min(~~(reconnect * 1.5), 2000)
        hub.reconnect = setTimeout(connect, reconnect, hub, url, reconnect)
      }
    }
  }
  hub.upstream = socket
}
