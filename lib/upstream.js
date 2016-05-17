'use strict'
const WsClient = require('websocket').w3cwebsocket
const vstamp = require('vigour-stamp')

exports.connected = {
  val: false,
  syncUp: false,
  syncDown: false
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
            console.log('close connection!!!!')
            if (hub.reconnect) {
              clearTimeout(hub.reconnect)
              hub.reconnect = null
            }
            hub.upstream.blockReconnect = true
            hub.upstream.close()
          }
          console.log('connect to url:', val)
          if (val) {
            connect(hub, val, 50)
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
    console.log('on open now we want to send some client and we want to create a client right hur')
    // maybe dont even have to send a client field just let it create a client fuck it connection is seperate from client?
    // not even a bad idea client has nothing to do with a connection... crazy but ncie
    const stamp = vstamp.create('connect')
    hub.connected.set(true, stamp)
    vstamp.close(stamp)
  }
  connection.onclose = () => {
    if (hub.connected) {
      const stamp = vstamp.create('disconnect')
      hub.connected.set(false, stamp)
      vstamp.close(stamp)
      if (!connection.blockReconnect) {
        reconnect = Math.min(~~(reconnect * 1.5), 2000)
        hub.reconnect = setTimeout(connect, reconnect, hub, url, reconnect)
      }
    }
    console.log('Reconnect time', reconnect)
  }
  hub.upstream = connection
}
