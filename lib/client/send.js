'use strict'
const vstamp = require('vigour-stamp')
const serialize = require('../serialize')

exports.define = {
  sendMeta () {
    const hub = this.root
    const id = hub.id
    const progress = send(this, void 0, id)
    const client = progress.$client || (progress.$client = { id })
    if (hub.subscriptions) {
      client.subscriptions = hub.subscriptions
    }
    client.context = hub.context ? hub.context.compute() : false
    send(this, void 0, id)
  },
  send (state, type, stamp, subs, force) {
    if (!subs || subs.val) {

      if (this.val === null) {
        throw new Error('CLIENT IS REMOVED! and trying to send' + this.root.id)
      }

      if (state.stamp && vstamp.type(state.stamp) !== 'context') {
        const id = this.id.compute()
        serialize(send(this, stamp, id), state, type, stamp, subs, this.upstream, force)
      }
    }
  }
}

function send (client, stamp, id) {
  const hub = client.root
  if (!hub.inprogress[hub.id]) {
    hub.inprogress[hub.id] = {}
  }
  const inprogress = hub.inprogress[hub.id]
  if (!inprogress[id]) {
    inprogress[id] = {}
    const rdy = () => {
      const hub = client.root
      inprogress[id].stamp = hub.stamp // remove client stamp
      // need ot do for ofc when it your own

      if (client.val === null) {
        delete inprogress[id]
        return
      }
      if (client.val !== null) {
        if (
          hub.id != client.id.compute() || // eslint-disable-line
          hub.connected && hub.connected.compute() === true
        ) {
          socketSend(client, inprogress, id)
          delete inprogress[id]
        } else {
          hub.connected.is(true, () => {
            socketSend(client, inprogress, id)
            delete inprogress[id]
          })
        }
      } else {
        delete inprogress[id]
      }
    }
    // if (!stamp) {
    process.nextTick(rdy)
    // } else {
    //   vstamp.done(stamp, rdy)
    // }
  }
  return inprogress[id]
}

function socketSend (client, inprogress, id) {
  if (client.val !== null) {
    if (inprogress[id]._force) { delete inprogress[id]._force }
    const payload = { state: inprogress[id] }
    // temp measure really not enough -- add shit loads of test cases
    if (client.socket.context && client.socket.context.context) {
      payload.context = client.socket.context.context.compute()
    }
    if (inprogress[id].$client) {
      payload.client = inprogress[id].$client
      delete inprogress[id].$client
    }
    let pass
    if (payload.state) {
      for (var i in payload.state) {
        if (i !== 'stamp') {
          pass = true
        }
      }
    }
    if (!pass) {
      delete payload.state
    }
    const string = JSON.stringify(payload)
    client.socket.send(string)
  }
}
