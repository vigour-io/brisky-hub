'use strict'
// TODO document URL format for TCP
// TODO make config not static
// TODO make a reconnection strategy
/* dependencies */
var Socket = require('net').Socket
var url = require('url')
var Event = require('vjs/lib/event')
var incoming = require('./incominghelper')

/* config */
const SOCKET_CONNECTION_TIMEOUT = 5000
const SOCKET_ENCODING = 'utf8'
const SOCKET_KEEPALIVE = true

exports.on = {
  value: {
    tcp (data, event) {
      console.log('tcp - rolling')
      this.startTcpClient(this.val, event)
    }
  }
}

exports.properties = {
  tcpClient: true
}

exports.define = {
  startTcpClient (url, event) {
    console.log(url)
    var adapter = this
    var client = this.tcpClient = adapter.getClient(event)
    var socket = new Socket()
    socket.send = socket.write
    // connect to TCP socket server
    socket.connect(url)

    // configure socket
    socket.setTimeout(SOCKET_CONNECTION_TIMEOUT)
    socket.setEncoding(SOCKET_ENCODING)
    socket.setKeepAlive(SOCKET_KEEPALIVE)

    // fired on successful connection
    socket.on('connect', function () {
      this.write(JSON.stringify({
        client: client.serialize(),
        stamp: event.stamp
      }))
      client.connection = socket
      socket.client = client
      adapter.emit('connection', client, event)
      socket.on('data', incoming(adapter, socket))
    })


    // fired on connection close
    socket.on('end', function () {
      adapter.emit('end', client)
    })

    // notifier for long inactivity
    socket.on('timeout', function () {
      adapter.emit('timeout', 'Socket timed out')
    })

    // fired when the coskcet receives an error, close is called immediately after
    socket.on('error', function (err) {
      adapter.emit('error', err)
    })

    // fired when socket is fully closed
    socket.on('close', function (had_error) {
      // TODO lets try to reconnect we can make a strategy for this!
      adapter.emit('close', client)
    })
  }
}
