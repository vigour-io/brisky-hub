'use strict'
const WsClient = require('websocket').w3cwebsocket
const vstamp = require('vigour-stamp')
const { ClocksyClient } = require('clocksy')

module.exports = function connect (hub, url, reconnect) {
  const connection = new WsClient(url, 'hubs')
  const id = hub.id
  // remove client as well?
  hub.set({ clients: { [id]: { id: id } } }, false)
  hub.set({ client: hub.clients[id] }, false)

  hub.reconnect = null

  // JSON.stringify(hub.queue)
  const clocksy = new ClocksyClient({
    sendRequest: (req) => connection.send(JSON.stringify({
      type: 'clock', data: req
    }))
  })

  connection.onerror = () => {
    connection.close()
  }
  connection.onmessage = (data) => {
    data = JSON.parse(data.data)
    if (data && data.type === 'clock') {
      const tDelta = clocksy.processResponse(data.data)
      console.log('TDELTA', tDelta)
    } else {
      // console.log('====> INCOMING ON CLIENT <====', data.state)
      hub.set(data.state, data.stamp)
      vstamp.close(data.stamp)
    }
  }
  connection.onopen = () => {
    clocksy.start()
    const stamp = vstamp.create('connect')
    hub.set({ connected: true }, stamp)
    vstamp.close(stamp)
  }
  connection.onclose = () => {
    clocksy.stop()
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
