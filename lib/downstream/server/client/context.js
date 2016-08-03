'use strict'
const vstamp = require('vigour-stamp')
module.exports = function createContext (hub, socket, client, stamp) {
  const id = client.id
  const ip = socket.upgradeReq.connection.remoteAddress
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
  contextHub.set({ clients: { [id]: { id, ip, upstream: hub.id, story: 'straight' } } }, stamp)
  const hClient = contextHub.clients[id]
  hClient.ip.stamp = vstamp.create('ip', contextHub.id) // no need to close
  hClient.socket = socket
  socket.client = hClient
  socket.context = contextHub
  return contextHub
}
