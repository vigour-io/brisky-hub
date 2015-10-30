'use strict'
/* dependencies */
var Connection = require('../../connection').Connection
var CLIENT_STATES = require('../../connection').CLIENT_STATES
var WebSocketServer = require('websocket').server
var W3CWebSocket = require('websocket').w3cwebsocket
var isNode = require('vjs/lib/util/is/node')
var http = require('http')

class WsConnection extends Connection {
  /**
   * Creates a WSConnection. If both URL and Secret are passed it also instantiate a new WsClient
   * @param  {string}   url     WebSocket Server endpoint
   * @param  {string}   secret  WebSocket Server secret
   */
  constructor (urlOrPort, secret) {
    super('ws')
    if (urlOrPort && secret) {
      if (isNaN(urlOrPort)) {
        this.client_send_method = 'send'
        this.connect(urlOrPort, secret)
      } else {
        this.listen(urlOrPort, secret)
      }
    }
  }

  /**
   * Creates a WebSocket client
   * @param  {string}   url     WebSocket Server endpoint
   * @param  {string}   secret  WebSocket Server secret
   */
  connect (url, secret) {
    if (!url) url = this.connectArgs[0]
    if (!secret) secret = this.connectArgs[1]
    this.connectArgs = [url, secret]
    var client = this.client = new W3CWebSocket(url, secret)
    client.onerror = () => {
      this.onError()
    }
    client.onmessage = (data) => {
      this.onData(data.data)
    }
    client.onopen = () => {
      this.client_state = CLIENT_STATES.READY
      this.onConnect()
    }
    client.onclose = () => {
      this.client_state = CLIENT_STATES.NOT_OPENED
      this.onDisconnect()
      if (this.retry) {
        this.reconnect()
      }
    }
  }

  /**
   * Creates a WebSocker server
   * @param  {string}   url     WebSocket Server port
   * @param  {string}   secret  WebSocket Server secret
   */
  listen (port, secret) {
    if (!isNode) {
      this.emit('error', new Error('ws can\'t listen for connections in a client'))
      return
    }

    this.port = port
    this.secret = secret

    let httpServer = getHttpServer()
    httpServer.listen(port, this.onListening)
    var server = this.server = new WebSocketServer({
      httpServer: httpServer
    })
    server.on('request', (request) => {
      var wsServerConn = request.accept(this.secret, request.origin)
      wsServerConn.on('message', (message) => {
        if (message.type === 'utf8') {
          this.onData({data: message.utf8Data, connection: wsServerConn})
        } else if (message.type === 'binary') {
          this.onData({data: message.binaryData, connection: wsServerConn})
        }
      })
      wsServerConn.on('close', (/* reasonCode, description */) => {
        this.emit('close', 'listener disconnected')
      })
    })
  }
}

/**
 * Returns an instance of HttpServer
 * @return {httpServer}
 */
var getHttpServer = () => {
  return http.createServer(function (request, response) {
    response.writeHead(404)
    response.end()
  })
}

module.exports = WsConnection
