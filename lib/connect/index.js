'use strict'
const WsClient = require('websocket').w3cwebsocket
const vstamp = require('vigour-stamp')

module.exports = function connect (hub, url) {
  const connection = new WsClient(url, 'hubs')
  connection.onerror = (err) => {
    console.log('some error in clientConnection', err)
  }
  connection.onmessage = (data) => {
    // now add a src to the stamp and its totally golden
    data = JSON.parse(data.data)
    // console.log('SET down -->', data.stamp, data.data)
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
  }
  hub.upstream = connection
}
