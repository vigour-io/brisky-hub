'use strict'
module.exports = function sendUpstream (hub) {
  // need to correct the stamps in here when reconnecting super important!!!!
  // if dced no offset then redo offset when rc
  if (hub.queue) {
    hub.upstream.send(JSON.stringify(hub.queue))
  } else {
    console.warn('allready send! too late must be a timing issue from brisky-events')
  }
  hub.queue = null
}
