'use strict'
module.exports = function sendUpstream (hub) {
  // console.log('yo yo yo send it!', hub.queue)
  hub.upstream.send(JSON.stringify(hub.queue))
  hub.queue = null
}
