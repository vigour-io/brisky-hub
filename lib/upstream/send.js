'use strict'

module.exports = function sendUpstream (hub) {
  // need to correct the stamps in here when reconnecting super important!!!!
  // if dced no offset then redo offset when rc
  if (hub.queue) {
    // never send it tough...
    // maybe just consume it here
    for (let stamp in hub.queue) {
      if (hub.queue.offset) { console.log('RIGHT HUR', stamp, hub.queue.offset) }
    }
    hub.upstream.send(JSON.stringify(hub.queue))
  } else {
    console.warn('allready send! too late must be a timing issue from brisky-events')
  }
  hub.queue = null
}
