'use strict'
const vstamp = require('vigour-stamp')
module.exports = function createContext (hub, connection, client, stamp) {
  const id = client.id
  const ip = connection.remoteAddress
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
  // ------------------------------
  // needs to be better best is too know if its upstrem
  contextHub.set({ clients: { [id]: { id: id, ip: ip } } }, stamp)
  const hClient = contextHub.clients[id]
  hClient.ip.stamp = vstamp.create('ip', contextHub.id) // no need to close
  hClient.connection = connection
  connection.client = hClient
  connection.context = contextHub
  return contextHub
}