'use strict'
const vstamp = require('vigour-stamp')
const parse = require('vigour-ua')
// call some functions from context folder
// context is where most of this stuff is
// ua on the server or somewhere else?

module.exports = function createContext (hub, socket, client, stamp) {
  const id = client.id
  const upgrade = socket.upgradeReq
  const ua = upgrade.headers['user-agent']
  const ip = socket.upgradeReq.connection.remoteAddress
  const clientobj = { id, ip, upstream: hub.id }

  if (ua) {
    const parsed = parse(ua)
    clientobj.device = parsed.device
    clientobj.platform = parsed.platform
    clientobj.browser = parsed.browser
    clientobj.ua = ua
  } else {
    clientobj.device = 'server'
    clientobj.platform = 'node.js'
  }

  var context = client.context
  var contextHub
  if (context === void 0) {
    context = ip
  }
  if (context === false) {
    contextHub = hub
  } else {
    contextHub = hub.getContext(context)
    if (!contextHub) {
      contextHub = new hub.Constructor({ context: context }, stamp)
    }
  }

  // why the fuck does it even have context in queue???
  if (contextHub !== hub && contextHub.clients && !contextHub.hasOwnProperty('clients')) {
    // console.log('x????')
    // contextHub.clients.remove(false)
    console.log(contextHub.clients)
    if (contextHub.clients === hub.clients) {
      console.log('this is it')
      contextHub.clients = void 0
      contextHub.set({ clients: {} })
    }
    // console.log('wtf is this', contextHub.clients)
  }

  contextHub.set({ clients: { [id]: clientobj } }, stamp)
  const hClient = contextHub.clients[id]
  hClient.ip.stamp = vstamp.create('ip', contextHub.id) // no need to close
  hClient.socket = socket
  socket.client = hClient

  if (socket.context && socket.context !== contextHub) {
    console.log('HERE NEED TO RESET!!!')
    const oldClient = socket.context.get([ 'clients', id ])
    oldClient.remove()
  }

  socket.context = contextHub
  return contextHub
}
