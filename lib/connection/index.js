'use strict'
var EventEmitter = require('events')
var isNode = require('vjs/lib/util/is/node')
var http = require('http')
var WebSocketServer = require('websocket').server
var uuid = require('vjs/lib/util/uuid')

class Connection extends EventEmitter {
  constructor (protocol) {
    // EventEmitter
    super()
    this.protocol = protocol
  }

  connect () {}
  reconnect () {}
  disconnect () {}
  listen () {
    this.listeners = {}
    this.server = true
  }
  send (data) {}
}

// global.Connection = Connection

class WsConnection extends Connection {
  constructor () {
    super('ws')
  }

  connect () {}

  listen (port, secret) {
    if (!isNode) {
      this.emit('error', new Error('ws can\'t listen for connections in a client'))
      return
    }

    super.listen()

    this.port = port
    this.secret = secret

    let httpServer = getHttpServer()
    httpServer.listen(port/*, () => {
      this.emit('listens', 'http server waiting for connections')
    }*/)
    var server = this.server = new WebSocketServer({
      httpServer: httpServer
    })
    server.on('request', (request) => {
      var wsServerConn = request.accept(this.secret, request.origin)
      // this.downstream.push(wsServerConn)
      wsServerConn.on('message', (message) => {
        if (message.type === 'utf8') {
          this.emit('data-string', message.utf8Data, wsServerConn)
        } else if (message.type === 'binary') {
          this.emit('data-stream', message.binaryData, wsServerConn)
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
