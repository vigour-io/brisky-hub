'use strict'
const inprogress = {}
// this can be a bit more tactical

const serialize = require('../serialize')

exports.define = {
  sendSubscriptions () {
    const hub = this.root
    const id = hub.id
    const payload = { id }
    // cant we just allways send the id?
    if (hub.subscriptions) {
      payload.subscriptions = hub.subscriptions
    }
    const progress = send(this)
    progress.client = payload
  },
  send (state, type, stamp, subs, tree, sType) {
    if (subs.val === true) {
      const id = this.id.compute()
      // this is where you repair offsets
      serialize(send(this, stamp, id), state, type, stamp, subs, tree, sType, id)
    }
  }
}

function send (client, stamp, id) {
  if (!inprogress[id]) {
    inprogress[id] = {}
    process.nextTick(() => {
      if (client.val !== null && client.socket) {
        const payload = { state: inprogress[id] }
        if (inprogress[id].client) {
          // .client really nessecary?
          payload.client = inprogress[id].client
          delete inprogress[id].client
        }
        // if not connected do something
        client.socket.send(JSON.stringify(payload))
      }
      delete inprogress[id]
    })
  }
  return inprogress[id]
}
