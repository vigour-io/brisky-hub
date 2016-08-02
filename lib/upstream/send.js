'use strict'

module.exports = function sendUpstream (hub) {
  if (hub.queue) {
    for (let stamp in hub.queue) {
      if (hub.queue.offset) { console.log('RIGHT HUR', stamp, hub.queue.offset) }
    }
    hub.upstream.send(JSON.stringify(hub.queue))
  }
  hub.queue = null
}
