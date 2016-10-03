'use strict'
const vstamp = require('vigour-stamp')
const isEmpty = require('vigour-util/is/empty')

exports.define = {
  receive (data) {
    if (data.state) {
      const hub = this
      const hubcontext = hub.context && hub.context.compute()
      if (!(!data.context && !hubcontext) && data.context != hubcontext) { //eslint-disable-line
        if (data.state && data.state.clients) {
          delete data.state.clients
        }
      }
      hub.set({ incoming: {} }, false)

      hub.incoming.receiving = {}

      console.log(' \n START')

      hub.set(data.state, false)

      if (!isEmpty(hub.incoming.receiving)) {
        console.log(hub.incoming.receiving)
        hub.emit('subscription', hub.incoming.receiving)
      } else {
        hub.emit('subscription')
      }
      delete hub.incoming.receiving

      // hub.incoming

      for (let stamp in hub.incoming) {
        vstamp.close(stamp)
      }

      hub.set({ incoming: false }, false)
    }
  }
}
