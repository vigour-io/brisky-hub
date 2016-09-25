'use strict'
const vstamp = require('vigour-stamp')

exports.define = {
  receive (data) {
    const hub = this
    const hubcontext = hub.context && hub.context.compute()
    if (!(!data.context && !hubcontext) && data.context != hubcontext) { //eslint-disable-line
      // console.log('CONTEXT', hub.id, data.context, hubcontext, data.context == hubcontext)
      if (data.state && data.state.clients) {
        delete data.state.clients
      }
    }

    hub.set({ incomingStamp: false }, false)
    // console.log('x?')

    // so it uses those stamp -- maybe how to solve this???
    hub.set(data.state, false)
    // this is messed up slow
    // needs a much smarter plan
    console.log('RECIEVE', hub.incomingStamp)

    // update to the top

    console.log(hub.incomingStamp.path)

    if (hub.incomingStamp) {
      const field = hub.get(hub.incomingStamp.path)
      var parent = field
      while (parent) {
        // may need to create context
        parent.stamp = hub.incomingStamp.stamp
        parent = parent.parent
      }
      hub.emit('subscription', data.state, hub.incomingStamp.stamp)
    } else {
      hub.emit('subscription')
    }

    hub.set({ incomingStamp: false }, false)
  }
}
