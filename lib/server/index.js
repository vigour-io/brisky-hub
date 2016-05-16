'use strict'
const WsServer = require('websocket').server
const http = require('http')
const isEmpty = require('vigour-util/is/empty')
const vstamp = require('vigour-stamp')
var cnt = 0

module.exports = function server (hub, port) {
  console.log('start server!', port)
  if (hub._server) {
    console.log('allready have server do something!')
  }

  const downstream = hub.downstream = {}

  let server = hub._server = new WsServer({
    httpServer: http.createServer().listen(port)
  })

  server.on('request', (req) => {
    const connection = req.accept('hubs', req.origin)
    cnt++
    const id = cnt
    // console.log('got conn!', connection.remoteAddress)
    downstream[id] = connection
    // console downstreams -- thats the name
    connection.on('message', (data) => {
      var payload
      if (data.type === 'utf8') {
        try {
          payload = JSON.parse(data.utf8Data)
          // have some kind of recieve mechanism
          // console.log('server in-->', id, payload)
          if (payload.subscription) {
            // subscribe (subs, update, tree, stamp, attach, id) {
            // id will be src id -- easier or scope
            hub.subscribe(payload.subscription, void 0, void 0, void 0, void 0, id)
          }
          if (payload.data) {
            hub.set(payload.data, payload.stamp)
            vstamp.close(payload.stamp)
          }
        } catch (e) {
          console.log('some weird error on the server', data.utf8Data, e.stack)
        }
      }
    })
    connection.on('close', () => {
      console.log('client dc -- remove the client (and that one its context when applicable)')
      delete downstream[id]
      if (isEmpty(downstream)) {
        console.log('no more clients maybe remove this scope?')
      }
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
