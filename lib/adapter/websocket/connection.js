'use strict'
/* dependencies */
var Connection = require('../../connection')
var SERVER_STATES = require('../../connection').SERVER_STATES
var CLIENT_STATES = require('../../connection').CLIENT_STATES
var WebSocketServer = require('websocket').server
var W3CWebSocket = require('websocket').w3cwebsocket
var isNode = require('vjs/lib/util/is/node')
var http = require('http')

class WsConnection extends Connection {
  constructor (url, secret) {
    super('ws')
    if (url && secret) {
      this.connect(url, secret)
    }
  }

  connect (url, secret) {
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
      this.onDisconnect()
    }
  }

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
      // this.downstream.push(wsServerConn)
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
