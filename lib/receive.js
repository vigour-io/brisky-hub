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

    // hub.set({ incomingStamps: {} }, false)
    // console.log('x?')

    // so it uses those stamp -- maybe how to solve this???
    hub.set(data.state, false)

    // this is messed up slow

    // needs a much smarter plan

    // dont need this...
    // for (let stamp in hub.incomingStamps) {
    //   console.log(stamp)
    //   // vstamp.close(stamp)
    // }
    // no stam?
    hub.emit('subscription')

    // hub.set({ incomingStamps: {} }, false)
  }
}
