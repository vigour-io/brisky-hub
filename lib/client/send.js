'use strict'

const serialize = require('../serialize')

exports.define = {
  sendMeta () {
    const hub = this.root
    const id = hub.id
    const progress = send(this, void 0, id)
    const client = progress.client || (progress.client = { id })
    if (hub.subscriptions) {
      client.subscriptions = hub.subscriptions
    }
    if (hub.context) {
      client.context = hub.context.compute()
    }
  },
  send (state, type, stamp, subs, tree, sType) {
    // make this gaurd fast
    if (this.root.val !== null) {
      // check if its an upstream send -- not !subs
      if (!subs || subs.val === true) {
        const id = this.id.compute()
        // this is where you repair offsets
        serialize(send(this, stamp, id), state, type, stamp, subs, tree, sType, id)
      }
    }
  }
}

function send (client, stamp, id) {
  // stamp can be removed
  const hub = client.root
  if (!hub.inprogress[hub.id]) {
    hub.inprogress[hub.id] = {}
  }
  const inprogress = hub.inprogress[hub.id]
  if (!inprogress[id]) {
    inprogress[id] = {}
    process.nextTick(() => {
      if (client.val === null) {
        delete inprogress[id]
        return
      }
      const hub = client.root
      if (client.val !== null) {
        console.log(hub.id, client.id.compute(), hub.connected && hub.connected.compute() === true)
        if (
          hub.id != client.id.compute() || // eslint-disable-line
          hub.connected && hub.connected.compute() === true
        ) {
          console.log('lets send it????', hub.id, client.id, hub.connected && hub.connected.compute() === true)
          // why are you connected here???
          socketSend(client, inprogress, id)
          delete inprogress[id]
        } else {
          // need to scope is to one instance... now this is prop broken
          hub.connected.is(true, () => {
            console.log('connected yo yo yo', client)
            socketSend(client, inprogress, id)
            delete inprogress[id]
          })
        }
      } else {
        delete inprogress[id]
      }
    })
  }
  return inprogress[id]
}

function socketSend (client, inprogress, id) {
  console.log('yo send', id, client, inprogress, (new Error()).stack)
  // need to check for connected this is an upstream
  if (client.val === null) {
    return
  }
  const payload = { state: inprogress[id] }
  if (inprogress[id].client) {
    payload.client = inprogress[id].client
    delete inprogress[id].client
  }
  client.socket.send(JSON.stringify(payload))
}
