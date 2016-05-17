'use strict'
const WsClient = require('websocket').w3cwebsocket
const vstamp = require('vigour-stamp')

exports.connected = {
  val: false,
  sync: false
}

exports.properties = {
  upstream: true,
  reconnect: true,
  url: {
    type: 'observable',
    on: {
      data: {
        connect () {
          const hub = this.cParent()
          const val = this.compute()
          if (hub.upstream) {
            if (hub.reconnect) {
              clearTimeout(hub.reconnect)
              hub.reconnect = null
            }
            hub.upstream.close()
          }
          console.log('connect to url:', val)
          if (val) {
            connect(this.getRoot(), val, 50)
          }
        }
      }
    }
  }
}

function connect (hub, url, reconnect) {
  const connection = new WsClient(url, 'hubs')
  hub.reconnect = null
  connection.onerror = () => {
    connection.close()
  }
  connection.onmessage = (data) => {
    data = JSON.parse(data.data)
    console.log('SET down -->', data.stamp, data.data)
    hub.set(data.data, data.stamp)
    vstamp.close(data.stamp)
  }
  connection.onopen = () => {
    const stamp = vstamp.create('connect')
    hub.connected.set(true, stamp)
    vstamp.close(stamp)
  }
  connection.onclose = () => {
    const stamp = vstamp.create('disconnect')
    hub.connected.set(false, stamp)
    vstamp.close(stamp)
    reconnect = Math.min(reconnect * 1.2, 2000)
    hub.reconnect = setTimeout(connect, reconnect, hub, url, reconnect)
    console.log('Reconnect time', reconnect)
  }
  hub.upstream = connection
}
