'use strict'
var WsServer = require('websocket').server
var WsClient = require('websocket').w3cwebsocket
var isNode = require('vigour-js/lib/util/is/node')
var http = require('http')
var Connection = require('../../connection')

/**
 * WebSocket connection
 */
var WsConnection = new Connection({
  on: {
    remove () {
      if (this.client && this.client._connection) {
        this.client._connection.drop()
      }
    }//,
    // data (data, ev) {
    //   if (ev.type === 'data' && data) {
    //     if (data.port && data.secret) {
    //       this.listen(data.port, data.secret)
    //     } else if (data.url && data.secret) {
    //       this.connect(data.url, data.secret)
    //     }
    //   }
    // }
  },
  define: {
    sendMethod: {
      value: 'send'
    },
    /**
     * Connect to a given endpoint
     * @param  {string} url    Websocket server endpoint
     * @param  {string} secret Websocket server security token
     */
    connect (url, secret) {
      if (!url) url = this.connectArgs[0]
      if (!secret) secret = this.connectArgs[1]
      this.connectArgs = [url, secret]

      // this is wrong connection needs access to the normal client as well!
      var wsClient = this.connClient = new WsClient(url, secret)
      wsClient.onerror = (err) => {
        this.emit('error', err)
      }
      wsClient.onmessage = (data) => {
        this.emit('message', data)
      }
      wsClient.onopen = () => {
        console.log('open!'.rainbow)
        this.onConnect()
        this.emit('open')
      }
      wsClient.onclose = () => {
        this.onDisconnect()
        this.emit('close')
        this.reconnect()
      }
    },
    /**
     * Creates a new websocket server
     * @param  {number} port   Websocket server port
     * @param  {string} secret Server secret
     */
    listen (port, secret) {
      console.log('hey biatch!'.rainbow)
      if (!isNode) {
        this.emit('error', 'WebSocket server can run just on node.js')
        return
      }
      var httpServer = http.createServer(function (req, res) {
        res.writeHead(404).end()
      }).listen(port)
      var wsServer = new WsServer({
        httpServer: httpServer
      })
      wsServer.on('request', (req) => {
        var wsServerConn = this.connClient = req.accept(secret, req.origin)
        wsServerConn.on('message', (message) => {
          if (message.type === 'utf8') {
            console.log('???', message.utf8Data)
            this.emit('data', message.utf8Data)
          } else if (message.type === 'binary') {
            this.emit('data', message.binaryData)
          }
        })
        wsServerConn.on('close', () => {
          if (wsServerConn.client) {
            // is this rly nessecary?
            this.emit('close', { client: wsServerConn.client.key })
          } else {
            this.emit('close')
          }
        })
      })
    }
  }
})

module.exports = WsConnection.Constructor
