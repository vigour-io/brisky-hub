'use strict'

module.exports = function sendUpstream (hub) {
  const queue = hub.queue
  if (queue) {
    // client has to be first allways
    for (let stamp in queue) {
      if (queue.offset) { console.log('RIGHT HUR', stamp, queue.offset) }
    }
    hub.upstream.send(JSON.stringify(queue))
    hub.queue = null
  }
}
