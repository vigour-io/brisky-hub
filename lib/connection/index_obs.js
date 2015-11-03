'use strict'
var Observable = require('vjs/lib/observable')

var Connection = new Observable({
  define: {
    RETRY_OPTIONS: {
      value: {
        MAX_TIMEOUT: 10000,
        TIMEOUT: 200,
        FACTOR: 1.2
      }
    },
    QUEUE_OPTIONS: {
      value: {
        DEQUEUE_SPEED: 500
      }
    },
    queue: {
      value: []
    },
    send: function (data) {
      if (this.clientState === 'DEQUEUING') {
        if (data.queue) {
          this.client[this.sendMethod](data.data)
        } else {
          this.queue.push({
            data: data.data ? data.data : data,
            queue: true})
        }
      } else if (this.clientState !== 'READY') {
        this.queue.push(data)
      } else {
        console.log('data', data, typeof data)
        this.client[this.sendMethod](data)
      }
    },
    reconnect: function () {
      console.log('reconnect')
    },
    onConnect: function () {
      this.clientState = 'READY'
      this.retryTimeout = null
      this.retryCount = 0
      if (this.queue.length) {
        let iter = (data) => {
          if (!data) {
            this.clientState = 'READY'
            return
          }
          this.clientState = 'DEQUEUING'
          this.send(data)
          // we need some delay before dequeuing, still don't know how much exactly
          setTimeout(() => {
            this.send({
              data: data.data ? data.data : data,
              queue: true
            })
            iter(this.queue.shift())
          }, this.QUEUE_OPTIONS.DEQUEUE_SPEED)
        }
        iter(this.queue.shift())
      }
    },
    onDisconnect: function () {
      this.clientState = 'NOT_OPENED'
    }
  }
}).Constructor

var WsServer = require('websocket').server
var WsClient = require('websocket').w3cwebsocket
var isNode = require('vjs/lib/util/is/node')
var http = require('http')

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
}).Constructor

module.exports.WsConnection = WsConnection
