'use strict'
const vstamp = require('vigour-stamp')

exports.define = {
  receive (data) {
    const hub = this
    const hubcontext = hub.context && hub.context.compute()
    if (!(!data.context && !hubcontext) && data.context != hubcontext) { //eslint-disable-line
      if (data.state && data.state.clients) {
        delete data.state.clients
      }
    }

    hub.set({ incomingStamps: {} }, false)

    // soo much faster again... saves all emits of course..
    // opt the shit out of that listener
    // 200ms to 150ms (25%!!!!)
    // false keeps the test ok which is ofc very strange...
    // something like 'incoming'
    hub.set(data.state, false) // not enough of course (false :/)

    console.log('fire recieve subscription', hub.context)

    hub.emit('subscription')
    for (let stamp in hub.incomingStamps) {
      vstamp.close(stamp)
    }

    hub.set({ incomingStamps: false }, false)
  }
}
