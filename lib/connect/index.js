'use strict'
const WsClient = require('websocket').w3cwebsocket

module.exports = function connect (hub, url) {
  const connection = new WsClient(url, 'hubs')
  connection.onerror = (err) => {
    console.log('some error in clientConnection', err)
  }
  connection.onmessage = (data) => {
    console.log('gotttz data', data, JSON.parse(data.data))
  }
  connection.onopen = () => {
    console.log('connect')
  }
  connection.onclose = () => {
    console.log('disconnect')
  }
}
