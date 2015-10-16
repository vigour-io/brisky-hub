'use strict'
var W3CWebSocket = require('websocket').w3cwebsocket

exports.on = {
  value: {
    websocket () {
      console.log('ok lets listen to this websocket server!', this.val)
      this.startWebsocketClient(this.val)
    }
  }
}

exports.properties = {
  websocketClient: true
}

exports.define = {
  startWebsocketClient (url) {
    var client = this.websocketClient = new W3CWebSocket('ws://localhost:3031/', 'echo-protocol')

    client.onerror = function () {
      console.log('Connection Error')
    }

    client.onopen = function () {
      console.log('WebSocket Client Connected')
      function sendNumber () {
        if (client.readyState === client.OPEN) {
          var number = Math.round(Math.random() * 0xFFFFFF)
          client.send(number.toString())
          setTimeout(sendNumber, 1000)
        }
      }
      sendNumber()
    }

    client.onclose = function () {
      console.log('echo-protocol Client Closed')
      // lets try to reconnect we can make a strategy for this!
    }

    client.onmessage = function (e) {
      if (typeof e.data === 'string') {
        console.log("Received: '" + e.data + "'")
      }
    }
  }
}

/*
var W3CWebSocket = require('websocket').w3cwebsocket
var client = new W3CWebSocket('ws://localhost:3030/', 'echo-protocol')

client.onerror = function () {
  console.log('Connection Error')
}

client.onopen = function () {
  console.log('WebSocket Client Connected')
  function sendNumber () {
    if (client.readyState === client.OPEN) {
      var number = Math.round(Math.random() * 0xFFFFFF)
      client.send(number.toString())
      setTimeout(sendNumber, 1000)
    }
  }
  sendNumber()
}

client.onclose = function () {
  console.log('echo-protocol Client Closed')
}

client.onmessage = function (e) {
  if (typeof e.data === 'string') {
    console.log("Received: '" + e.data + "'")
  }
}
*/
