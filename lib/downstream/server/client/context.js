'use strict'
const vstamp = require('vigour-stamp')
const parse = require('vigour-ua')
module.exports = function createContext (hub, socket, client, stamp) {

  console.log('need to do stuff, need to know if client exists somehwere else!')
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
      contextHub = new hub.Constructor({ context: context, clients: {} }, stamp)
      contextHub.clients.each((prop, key) => {
        if (prop._parent === hub.clients) {
          console.log(key)
          contextHub.clients[key].remove()
        }
      })
    }
  }

  contextHub.set({ clients: { [id]: clientobj } }, stamp)
  const hClient = contextHub.clients[id]
  hClient.ip.stamp = vstamp.create('ip', contextHub.id) // no need to close
  hClient.socket = socket
  socket.client = hClient

  if (socket.context) {
    console.log('HERE NEED TO RESET!!!')
    const oldClient = socket.context.get([ 'clients', id ])
    const oldHub = socket.context
    console.log(oldHub.clients === contextHub.clients)
    oldClient.remove() // stamp
  }

  socket.context = contextHub
  return contextHub
}
