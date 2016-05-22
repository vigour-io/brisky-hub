'use strict'
const WsClient = require('websocket').w3cwebsocket
const vstamp = require('vigour-stamp')

module.exports = function connect (hub, url, reconnect) {
  const connection = new WsClient(url, 'hubs')
  const id = hub.id
  // remove client as well?
  hub.set({ clients: { [id]: { id: id } } }, false)
  hub.set({ client: hub.clients[id] }, false)

  hub.reconnect = null
  connection.onerror = () => {
    connection.close()
  }
  connection.onmessage = (data) => {
    data = JSON.parse(data.data)
    // console.log('====> INCOMING ON CLIENT <====', data.state)
    hub.set(data.state, data.stamp)
    vstamp.close(data.stamp)
  }
  connection.onopen = () => {
    const stamp = vstamp.create('connect')
    hub.set({ connected: true }, stamp)
    vstamp.close(stamp)
  }
  connection.onclose = () => {
    if (hub.connected) {
      const stamp = vstamp.create('disconnect')
      hub.set({ connected: false }, stamp)
      vstamp.close(stamp)
      if (!connection.blockReconnect) {
        reconnect = Math.min(~~(reconnect * 1.5), 2000)
        hub.reconnect = setTimeout(connect, reconnect, hub, url, reconnect)
      }
    }
  }
  hub.upstream = connection
}
