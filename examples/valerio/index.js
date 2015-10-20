var colors = require('colors')
var Protocol = require('../../lib/protocol')
var Connection = require('../../lib/connection')
var WsProtocol = require('../../lib/adapter/websocket/protocol')
var WsConnection = require('../../lib/adapter/websocket/connection')
var Hub = require('../../lib/')

var info = colors.bold.cyan

console.log(info('Testing protocol'))

var p1 = new Protocol({
  url: 'test',
  listens: 'cazz'
})

console.log(info('Testing connections'))

var c1 = new Connection({
  protocol: {
    url: 'dio cane',
    listens: 'azz'
  }
})

c1.send('test')

var wsc1 = new WsConnection()

wsc1.connect('ws://echo.websocket.org')
