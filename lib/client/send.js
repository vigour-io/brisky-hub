'use strict'
// const inprogress = {}

const serialize = require('../serialize')

exports.define = {
  sendMeta () {
    const hub = this.root
    const id = hub.id
    const progress = send(this, void 0, id)
    const client = progress.client || (progress.client = { id })
    // cant we just allways send the id?
    if (hub.subscriptions) {
      client.subscriptions = hub.subscriptions
    }
    if (hub.context) {
      client.context = hub.context.compute()
    }
  },
  send (state, type, stamp, subs, tree, sType) {
    // check if its an upstream send -- not !subs
    if (!subs || subs.val === true) {
      const id = this.id.compute()
      // this is where you repair offsets
      serialize(send(this, stamp, id), state, type, stamp, subs, tree, sType, id)
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
  // const from = client.root.id
  // console.log('in progress..', id, from)
  if (!inprogress[id]) {
    // console.log('create progress..', id, from)
    inprogress[id] = {}
    process.nextTick(() => {
      // console.log('next tick', id, from)
      if (client.val === null) {
        delete inprogress[id]
        // console.log('client is allreaydy removed ' + client.id, id, from)
        return
      }
      const hub = client.root
      if (client.val !== null) {
        if (
          hub.id != client.id || // eslint-disable-line
          hub.connected && hub.connected.compute() === true
        ) {
          socketSend(client, inprogress, id)
          // console.log('clear progress', id)
          delete inprogress[id]
        } else {
          // console.log('add listener', from)
          // needs attach as well....
          hub.connected.is(true, () => {
            // console.log('complete listener', from)
            socketSend(client, inprogress, id)
            // console.log('clear progress', id, from)
            delete inprogress[id]
          })
        }
      } else {
        // console.log('clear progress', id, from)
        delete inprogress[id]
      }
    })
  }
  return inprogress[id]
}

function socketSend (client, inprogress, id) {
  if (client.val === null) {
    // this can be removed when attach -- add it to is
    // fix once as well
    // console.log('socketSend - client is allreaydy removed - needs attach' + client.id, id)
    return
  }
  const payload = { state: inprogress[id] }
  if (inprogress[id].client) {
    payload.client = inprogress[id].client
    delete inprogress[id].client
  }
  // console.log('go send out!', id, client.root.id, payload)
  client.socket.send(JSON.stringify(payload))
}
