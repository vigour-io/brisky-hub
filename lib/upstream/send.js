'use strict'
module.exports = function sendUpstream (hub) {
  if (hub.queue) {
    hub.upstream.send(JSON.stringify(hub.queue))
  } else {
    console.warn('allready send! too late must be a timing issue from brisky-events')
  }
  hub.queue = null
}