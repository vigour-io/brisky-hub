'use strict'
var EventEmitter = require('events')
var isNode = require('vjs/lib/util/is/node')
var http = require('http')
var WebSocketServer = require('websocket').server
var W3CWebSocket = require('websocket').w3cwebsocket
var uuid = require('vjs/lib/util/uuid')

var CLIENT_STATES = {
  NOT_OPENED: 0,
  CONNECTING: 1,
  READY: 2
}

var SERVER_STATES = {
  NOT_OPENED: 0,
  LISTENING: 1
}

Object.freeze(CLIENT_STATES)
Object.freeze(SERVER_STATES)

class Connection extends EventEmitter {
  constructor (type) {
    // EventEmitter
    super()
    this.type = type
    this.client_state = CLIENT_STATES.NOT_OPENED
    this.server_state = SERVER_STATES.NOT_OPENED
  }
  send (data) {
    this.client_send
  }
  onListening () {
    this.emit('listens', 'http server waiting for connections')
    this.server_state = SERVER_STATES.LISTENING
  }
  onError (err) {
    this.emit('error', err)
  }
  onConnect () {
    this.client_state = CLIENT_STATES.READY
  }
  onData (data) {
    this.emit('data', data)
  }
}


// global.Connection = Connection
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
