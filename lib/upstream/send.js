'use strict'

module.exports = function sendUpstream (hub) {
  if (hub.queue) {
    for (let stamp in hub.queue) {
      // offset correction
      if (hub.queue.offset) { console.log('RIGHT HUR', stamp, hub.queue.offset) }
    }
    hub.upstream.send(JSON.stringify(hub.queue))
  } else {
    console.warn('allready send! too late must be a timing issue from brisky-events')
  }
  hub.queue = null
}
