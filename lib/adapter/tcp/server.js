'use strict'
var net = require('net')
var incoming = require('./incominghelper')
exports.listens = {
  on: {
    data: {
      websocket () {
        this.parent.startTcpServer(this.val)
      }
    }
  }
}

exports.properties = {
  tcpServer: true
}

exports.define = {
  startTcpServer (port) {
    if (this.tcpServer) {
      console.log(adapter.path.join(' -> ') + '"tcp server is allready started -- not implemented yet ' + port + '"')
      return
    }
    var adapter = this
    var server = this.tcpServer = net.createServer()

    // called on new connection
    server.on('connection', function (socket) {
      var listener = incoming(adapter, socket)
      socket.send = socket.write
      socket.on('end', function () {
        socket.send = function () {}
        socket.removeListener('data', listener)
      })
      socket.on('data', listener)
      adapter.emit('connection', 'TCP Server new socket connected')
    })

    // called when TCP server is actually listening
    server.on('listening', function () {
      adapter.emit('listens', 'TCP Server listening')
    })

    // called on server close after all the connections are closed
    server.on('close', function () {
      adapter.emit('close', 'TCP Server closed')
    })

    // emitted when error occur, close is called immediately after this
    server.on('error', function (err) {
      adapter.emit('error', err)
    })

    server.listen(port)
  }
}
