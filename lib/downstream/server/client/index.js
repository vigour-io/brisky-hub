'use strict'
const createContext = require('./context')
const vstamp = require('vigour-stamp')

module.exports = function (hub, data, connection) {
  console.log(' \n:D new client connected', hub.id)
  const client = data.client
  const id = client.id

  if (connection.client && connection.client.key === id) {
    console.log('allready have client -- RECONN -- strange!')
  }
  if (connection.context && connection.context !== data.client.context) {
    console.log('old context remove client there!, when no clients remove the whole thing')
  }
  const parsed = vstamp.parse(client.stamp)
  const stamp = vstamp.create(parsed.type, parsed.src || id, parsed.val)
  const context = createContext(hub, connection, client, stamp)
  // ------------------------------
  if (client.subscriptions) {
    for (let i in client.subscriptions) {
      context.subscribe(client.subscriptions[i], void 0, void 0, stamp, context.clients[id])
    }
  }
  console.log('set upstream')
  vstamp.close(stamp)
  delete data.client
}
