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
  sendMethod: 'send',
  define: {
    /**
     * Connect to a given endpoint
     * @param  {string} url    Websocket server endpoint
     * @param  {string} secret Websocket server security token
     */
    connect (url, secret) {
      // make url and secret observables do connect from url

      // get rid of this little part
      if (!url) url = this.connectArgs[0]
      if (!secret) secret = this.connectArgs[1]
      this.connectArgs = [url, secret]
      // kill it!

      var wsClient = this.internalClient = new WsClient(url, secret)
      wsClient.onerror = (err) => {
        this.emit('error', err)
      }
      wsClient.onmessage = (data) => {
        console.log('client msg')
        this.emit('message', data)
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
    /**
     * Creates a new websocket server
     * @param  {number} port   Websocket server port
     * @param  {string} secret Server secret
     */
    listen (port, secret) {
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
        var wsServerConn = this.internalClient = req.accept(secret, req.origin)
        wsServerConn.on('message', (message) => {
          if (message.type === 'utf8') {
            this.emit('message', message.utf8Data)
          } else if (message.type === 'binary') {
            this.emit('message', message.binaryData)
          }
        })
        wsServerConn.on('close', () => {
          this.emit('close') // remove?
        })
      })
    }
  }
})

module.exports = WsConnection.Constructor
