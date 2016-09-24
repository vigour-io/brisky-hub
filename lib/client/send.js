'use strict'
const vstamp = require('vigour-stamp')
const serialize = require('../serialize')

const chunkSize = 2000

exports.define = {
  sendMeta () {
    const hub = this.root
    const id = hub.id
    const progress = send(this, void 0, id)
    const client = progress.client || (progress.client = { id })
    if (hub.subscriptions) {
      client.subscriptions = hub.subscriptions
    }
    client.context = hub.context ? hub.context.compute() : false
    send(this, void 0, id)
  },
  send (state, type, stamp, subs, tree, sType) {
    if (this.root.val !== null) {
      // check if its an upstream send -- not !subs
      if (!subs || subs.val === true) {
        // console.log(state.stamp)
        if (state.stamp && vstamp.type(state.stamp) !== 'context') {
          const id = this.id.compute()
          // this is where you repair offsets
          serialize(send(this, stamp, id), state, type, stamp, subs, tree, sType, id)
        }
      }
    }
  }
}

// remove stamp
function send (client, stamp, id) {
  // dont need id make this cleaner
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

      // need shit loads of test cases here
      // console.log('   ----->', id, hub && hub.context)

      if (client.val !== null) {
        if (
          // remove id need to see if its ok
          // this defintly needs context control this is totally wrong!
          hub.id != client.id.compute() || // eslint-disable-line
          hub.connected && hub.connected.compute() === true
        ) {
          socketSend(client, inprogress, id)
          delete inprogress[id]
        } else {
          // need to scope is to one instance... now this is prop broken
          // 100000x test with context
          hub.connected.is(true, () => {
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
  if (client.val !== null) {
    const payload = { state: inprogress[id] }

    // temp measure really not enough -- add shit loads of test cases
    if (client.socket.context && client.socket.context.context) {
      payload.context = client.socket.context.context.compute()
    }

    if (inprogress[id].client) {
      payload.client = inprogress[id].client
      delete inprogress[id].client
    }

    const string = JSON.stringify(payload)
    // chunkSize
    // lets do somehting better then stringify need to split it up also in terms of the receiver
    // console.log(payload)
    // // as an extra step we can just send parts of the tree
    // if (string.length > chunkSize) {
    //   // try to split it up in json objects how?
    //   const arr = []
    //   for (let i = 0, len = Math.ceil(string.length / chunkSize); i < len; i++) {
    //    if (i === len - 1) {
    //       arr.push('|' + string.slice(i * chunkSize, (i + 1) * chunkSize) + '$|')
    //     } else {
    //       arr.push('|' + string.slice(i * chunkSize, (i + 1) * chunkSize) + '|')
    //     }
    //   }
    //   buff(client, arr)
    //   console.log('lets split up', string.length / chunkSize)
    // } else {
    client.socket.send(string)
    // }
  }
}

// function buff (client, arr) {
//   client.socket.send(arr.shift())
//   if (arr.length) {
//     setTimeout(() => {
//       buff(client, arr)
//     }, 100)
//   }
// }
