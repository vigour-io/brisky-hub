'use strict'
const createContext = require('./context')
const vstamp = require('vigour-stamp')

module.exports = function (hub, data, connection) {
  const client = data.client
  const id = client.id
  if (connection.client && connection.client.key === id) {
    console.log('allready have client -- RECONN')
  }
  if (connection.context && connection.context !== data.client.context) {
    // if (!connection.client) error!
    // can have multiple clients / contexts -- for multi clients (one hub to other)
    console.log('old context remove client there!, when no clients remove the whole thing')
    // switching contexts pretty important fix it
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
  vstamp.close(stamp)
  delete data.client
}
