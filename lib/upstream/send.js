'use strict'

module.exports = function sendUpstream (hub) {
  if (hub.queue) {
    console.log(' \n:up-send', hub.id, Object.keys(hub.queue))
    for (let stamp in hub.queue) {
      // offset correction
      if (hub.queue.offset) { console.log('RIGHT HUR', stamp, hub.queue.offset) }
    }
    hub.upstream.send(JSON.stringify(hub.queue))
  }
  hub.queue = null
}
