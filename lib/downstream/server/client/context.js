'use strict'
const vstamp = require('vigour-stamp')
const parse = require('vigour-ua')
module.exports = function createContext (hub, socket, client, stamp) {
  const id = client.id
  const upgrade = socket.upgradeReq
  const ua = upgrade.headers['user-agent']
  const parsed = parse(ua)
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

  const clientobj = {
    id,
    ip,
    upstream: hub.id,
    device: parsed.device,
    platform: parsed.platform,
    browser: parsed.browser,
    ua: ua
  }

  contextHub.set({ clients: { [id]: clientobj } }, stamp)
  const hClient = contextHub.clients[id]
  hClient.ip.stamp = vstamp.create('ip', contextHub.id) // no need to close
  hClient.socket = socket
  socket.client = hClient
  socket.context = contextHub
  return contextHub
}
