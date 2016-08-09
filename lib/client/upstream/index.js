'use strict'
const send = require('../../upstream/send')

module.exports = function upstreamClient (hub, stamp) {
  if (hub.connected && hub.connected.compute()) {
    var queue = hub.queue
    if (!queue) {
      queue = hub.queue = {}
    }
    queue.client = { id: hub.id, stamp: stamp }
    if (hub.context) {
      // so this needs to be called on context
      let context = hub.context.compute()
      if (context !== void 0 && context !== null) {
        queue.client.context = context
      }
    }
    if (hub.subscriptions) {
      queue.client.subscriptions = hub.subscriptions
    }
    send(hub)
  }
}
