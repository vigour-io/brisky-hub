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

  if (contextHub !== hub && contextHub.clients && !contextHub.hasOwnProperty('clients')) {
    if (contextHub.clients === hub.clients) {
      contextHub.clients = void 0
      contextHub.set({ clients: {} })
      if (hub.clients.sort) {
        contextHub.clients.set({ sort: hub.clients.sort })
      }
    }
  }

  contextHub.set({ clients: { [id]: clientobj } }, stamp)
  const hClient = contextHub.clients[id]
  hClient.ip.stamp = vstamp.create('ip', contextHub.id) // no need to close
  hClient.socket = socket
  socket.client = hClient

  if (socket.context && socket.context !== contextHub) {
    const oldClient = socket.context.get([ 'clients', id ])
    oldClient.remove()
  }

  socket.context = contextHub
  return contextHub
}
