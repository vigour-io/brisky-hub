'use strict'
const vstamp = require('vigour-stamp')

exports.define = {
  getContext (context) {
    const instances = this.instances
    if (instances) {
      for (let i = 0, len = instances.length; i < len; i++) {
        if (instances[i].context.compute() === context) {
          return instances[i]
        }
      }
    }
  }
}

exports.properties = {
  context: {
    val: false,
    sync: false,
    on: {
      data: {
        context (val, stamp) {
          if (this.val !== null) {
            // @NOTE: I put extra guard here to check for removed since moving stamp updates to set
            const hub = this.root
            const client = hub.client && hub.client.origin()
            if (client && client.val !== null) {
              if (stamp) {
                vstamp.done(stamp, () => removeClients(hub))
              } else {
                removeClients(hub)
              }
              client.sendMeta()
            }
          }
        }
      }
    }
  }
}

function removeClients (hub) {
  const contextStamp = vstamp.create('context')
  hub.clients.each((client, key) => {
    if (key != hub.id) { //eslint-disable-line
      client.remove(contextStamp) // do we use the stamp name
    }
  })
  vstamp.close(contextStamp)
}
