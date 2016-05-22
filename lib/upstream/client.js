'use strict'
module.exports = function upstreamClient (hub, stamp) {
  var queue = hub.queue
  if (!queue) {
    queue = hub.queue = {}
  }
  queue.client = { id: hub.id, stamp: stamp }
  if (hub.context) {
    let context = hub.context.compute()
    if (context !== void 0 && context !== null) {
      queue.client.context = context
    }
  }
  if (hub.subscriptions) {
    queue.client.subscriptions = hub.subscriptions
  }
}
