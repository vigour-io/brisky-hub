'use strict'
const WsServer = require('websocket').server
const http = require('http')

module.exports = function server (hub, port) {
  console.log('start server!', port)
  if (hub._server) {
    console.log('allready have server do something!')
  }

  let server = hub._server = new WsServer({
    httpServer: http.createServer().listen(port)
  })

  server.on('request', (req) => {
    const connection = req.accept('hubs', req.origin)
    console.log('got conn!', connection.remoteAddress)
    connection.on('message', (data) => {
      var payload
      if (data.type === 'utf8') {
        try {
          payload = JSON.parse(data.utf8Data)
          // have some kind of recieve mechanism
          console.log('in-->', payload)
        } catch (e) {
          console.log('error cant parse json', data.utf8Data)
        }
      }
    })
    connection.on('close', () => {
      console.log('client dc -- remove the client (and that one its context when applicable)')
    })
  })

  return server
}

/*
  default payload
  uid: 'client-uid',
  scope: 'scope' // if no scope get ip address (?)
  subscription: {}, // functions special
  data: {} -- in what kind of form ? just object for now...
*/

/*
  caching payload on raf -- this is a very good practice
*/
