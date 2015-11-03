'use strict'
var WsServer = require('websocket').server
var WsClient = require('websocket').w3cwebsocket
var isNode = require('vjs/lib/util/is/node')
var http = require('http')
var Connection = require('../../connection')

var WsConnection = new Connection({
  define: {
    sendMethod: {
      value: 'send'
    },
    connect: function (url, secret) {
      if (!url) url = this.connectArgs[0]
      if (!secret) secret = this.connectArgs[1]
      this.connectArgs = [url, secret]
      var wsClient = this.client = new WsClient(url, secret)
      wsClient.onerror = () => {
        this.emit('error')
      }
      wsClient.onmessage = (data) => {
        this.emit('data', data.data)
      }
      wsClient.onopen = () => {
        this.onConnect()
        this.emit('connect')
      }
      wsClient.onclose = () => {
        this.onDisconnect()
        this.emit('disconnect')
        this.reconnect()
      }
    },
    listen: function (port, secret) {
      if (!isNode) {
        this.emit('error', 'WebSocket server can run just on node.js')
      }
      var httpServer = http.createServer(function (req, res) {
        res.writeHead(404).end()
      }).listen(port)
      var wsServer = new WsServer({
        httpServer: httpServer
      })
      wsServer.on('request', (req) => {
        var wsServerConn = req.accept(secret, req.origin)
        wsServerConn.on('message', (message) => {
          if (message.type === 'utf8') {
            this.emit('data', {data: message.utf8Data, connection: wsServerConn})
          } else if (message.type === 'binary') {
            this.emit('data', {data: message.binaryData, connection: wsServerConn})
          }
        })
        wsServerConn.on('close', () => {
          if (wsServerConn.client) {
            this.emit('close', {client: wsServerConn.client.key})
          } else {
            this.emit('close')
          }
        })
      })
    }
  }
})

module.exports = WsConnection.Constructor
